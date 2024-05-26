'use server';

import prisma from './db';
import { auth } from '@clerk/nextjs';
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

function authenticateAndRedirect(): string {
    const { userId } = auth();
    if (!userId) {
      redirect('/');
    }
    return userId;
  }

export async function createJobAction(values: CreateAndEditJobType): Promise<JobType | null> {
    const userId = authenticateAndRedirect()
    try {
        const job: JobType = await prisma.job.create({
            data: {
              ...values,
              clerkId: userId,
            },
          });
        return job
    } catch (error) {
        return null
    }
}