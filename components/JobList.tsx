'use client'
import React from 'react'
import JobCard from './JobCard'
import { useSearchParams } from 'next/navigation'
import { getAllJobActions } from '@/utils/actions'
import { useQuery } from '@tanstack/react-query'


const JobList = () => {
  const searchParams = useSearchParams()

  const search = searchParams.get('search') || ''
  const jobStatus = searchParams.get('') || 'all'
  const pageNumber = Number(searchParams.get('page')) || 1

  const {data, isPending} = useQuery({
    queryKey: ['jobs', search ?? '', jobStatus, pageNumber],
    queryFn: () => getAllJobActions(({search,jobStatus,page:pageNumber}))
  })
  const jobs = data?.jobs || []

  if(isPending) return <h2 className='text-xl'>Please Wait...</h2>;
  if(jobs.length < 1) return <h2 className='text-xl'>No Jobs Found...</h2>;

  return (
    <>
      <div className='grid md:grid-cols-2  gap-8'>
        {jobs.map((job) => {
          return <JobCard key={job.id} job={job} />
        })}
      </div>
    </>
  )
}

export default JobList
