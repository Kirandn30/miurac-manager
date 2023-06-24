import React, { useEffect, useState } from 'react'
import { ActionIcon, Text } from "@mantine/core"
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

export const PaginationComponent = ({ totalDocs, pageNumber, setPageNumber }: {
    totalDocs: number
    pageNumber: number
    setPageNumber: React.Dispatch<React.SetStateAction<number>>
}) => {

    const [maxPages, setMaxPages] = useState(0)

    useEffect(() => {
        setMaxPages(Math.ceil(totalDocs / 10))
    }, [totalDocs])


    return (
        <div className='flex gap-x-3'>
            <ActionIcon variant='outline' onClick={() => setPageNumber(prev => {
                if (prev === 1) {
                    return prev
                }
                return prev - 1
            })}>
                <IconChevronLeft color='gray' />
            </ActionIcon>
            <ActionIcon>
                <Text>{pageNumber}</Text>
            </ActionIcon>
            <ActionIcon variant='outline' onClick={() => setPageNumber(prev => {
                if (prev === maxPages) {
                    return prev
                }
                return prev + 1
            })}>
                <IconChevronRight color='gray' />
            </ActionIcon>
        </div>
    )
}
