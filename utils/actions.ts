'use server';
import prisma from './db';
import { auth } from '@clerk/nextjs/server';
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

function authenticateAndRedirect(): string {
  const { userId } = auth();
  console.log('userId',userId)
  if (!userId) {
    redirect('/');
  }
  return userId;
}

export async function createJobAction(
  values: CreateAndEditJobType
): Promise<JobType | null> {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const userId = authenticateAndRedirect();
  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: {
        ...values,
        clerkId: userId,
      },
    });
    return job;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type GetAllJobActionsType = {
  search?: string,
  jobStatus?: string,
  page?: number,
  limit?: number
}

export async function getAllJobActions({
  search,
  jobStatus,
  page,
  limit
}: GetAllJobActionsType):Promise<{
  jobs: JobType[];
  count: number;
  page: number;
  totalPages: number;
}> {
  const userId = authenticateAndRedirect();

  try {
    let whereClause: Prisma.JobWhereInput = {
      clerkId: userId
    }

    if(search){
      whereClause = {
        ...whereClause,
        OR: [
          {
            position: {
              contains:search
            },
          },
          {
          company:{
            contains:search
          }
          }
        ]
      }
    }

    if (jobStatus && jobStatus !== 'all') {
      whereClause = {
        ...whereClause,
        status: jobStatus,
      };
    }

    
    const jobs: JobType[] = await prisma.job.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return {jobs, count:0, page: 1, totalPages: 0}
  } catch (error) {
    return {jobs: [], count:0, page: 1, totalPages: 0}
  }
}

export async function deleteJobAction(id: string): Promise<JobType | null> {
  const userId = authenticateAndRedirect()
  try {
    const jobs: JobType = await prisma.job.delete({
      where:{
        id,
        clerkId:userId
      }
    })
    return jobs;
  } catch (error) {
    return null
  }
}

export async function getSingleJobAction(id: string): Promise<JobType | null>{
  let job: JobType | null = null
  let userId = authenticateAndRedirect()
  try {
    job = await prisma.job.findUnique({
      where:{
        id,
        clerkId:userId
      }
    })
  } catch (error) {
    job = null
  }
  if(!job){
    redirect('/jobs')
  }
  return job
}

export async function updateJobAction(
  id:string,
  values:CreateAndEditJobType
): Promise<JobType | null>  {
  const userId = authenticateAndRedirect()
  try {
    const job: JobType = await prisma.job.update({
      where:{
        id,
        clerkId:userId
      },
      data:{
        ...values
      }
    })
    return job;
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getStatsAction(): Promise<{
  pending:number,
  interview:number,
  declined:number
}> {
  const userId = authenticateAndRedirect()
  try {
    const stats = await prisma.job.groupBy({
      by:['status'],
      _count:{
        status:true
      },
      where:{
        clerkId:userId
      }
    })
    // console.log('stats',stats)
    const statsObject = stats.reduce((acc,curr)=>{
      acc[curr.status] = curr._count.status
      return acc
    },{} as Record<string, number>)
    console.log('statsObject',statsObject)
    const defaultStats = {
      declined:0,
      pending:0,
      interview:0,
      ...statsObject
    }
    return defaultStats
    } catch (error) {
    console.log(error)
    redirect('/jobs')
  }
}