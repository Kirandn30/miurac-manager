import { ActionIcon, Button, Select, TextInput } from '@mantine/core';
import { IconCirclePlus, IconSearch, IconX } from '@tabler/icons-react';
import { debounce } from 'lodash';
import React, { useRef, useEffect } from 'react'
import { EventsFilter } from './EventFilter';

export const Actions = ({ setEventModal, setGroundModal, searchData, setFilterValue, setfilterBy, filterBy, filterValue, filterData, setFilterQueries }: {
    setEventModal?: React.Dispatch<React.SetStateAction<{
        modal: boolean;
        data: null | any;
    }>>
    setGroundModal?: React.Dispatch<React.SetStateAction<{
        modal: boolean;
        data: null | any;
    }>>

    searchData: {
        label: string,
        value: string,
    }[]
    setfilterBy: React.Dispatch<React.SetStateAction<string | null>>
    setFilterValue: React.Dispatch<React.SetStateAction<string | null>>
    filterBy: string | null
    filterValue: string | null
    filterData: {
        data1: {
            label: string | boolean;
            value: string | boolean;
        }[];
        data2?: {
            value: string;
            label: string;
            type: string;
        }[];
    }
    setFilterQueries: React.Dispatch<React.SetStateAction<{
        filter: string | null;
        filter2: string[];
    }>>



}) => {
    const textRef = useRef<any>();

    const changed = debounce((text) => {
        setFilterValue(text);
    }, 800);

    useEffect(() => {
        setfilterBy(searchData[0].value)
    }, [])


    return (
        <div className="grid md:grid-cols-4 grid-cols-2 justify-center gap-3 my-5 bg-[#f0eeee] p-5 rounded-xl">
            <div className="col-span-2 grid grid-cols-3 gap-x-3">
                <Select
                    defaultValue={filterBy}
                    placeholder="Select"
                    data={searchData}
                    onChange={(e) => { e && setfilterBy(e) }}
                    value={filterBy}
                />
                <TextInput
                    onChange={(e) => changed(e.target.value.toLowerCase())}
                    className="col-span-2"
                    icon={<IconSearch size={20} color="gray" className="min-h-full" />}
                    placeholder="Search here.."
                    ref={textRef}
                    rightSection={
                        filterValue && (
                            <ActionIcon
                                size="sm"
                                variant='outline'
                                onClick={() => {
                                    if (textRef.current) {
                                        textRef.current.value = '';
                                        setFilterValue(null)
                                    }
                                }}
                            >
                                <IconX />
                            </ActionIcon>
                        )
                    }
                />
            </div>
            <EventsFilter
                filterData={filterData}
                setFilterQueries={setFilterQueries}
            />
            {["events", "grounds"].includes(window.location.pathname.split("/")[1]) ? <Button
                variant='gradient'
                onClick={() => {
                    if (window.location.pathname.split("/")[1] === "events") {
                        setEventModal && setEventModal({ data: null, modal: true })
                    } else if (window.location.pathname.split("/")[1] === "grounds") {
                        setGroundModal && setGroundModal({ data: null, modal: true })
                    }
                }}
            >
                <IconCirclePlus />
                <span className='hidden lg:block'>&nbsp; Create</span>
                <span className=""> &nbsp; {capitalizeFirstLetter(window.location.pathname.split("/")[1])}</span>
            </Button> : <div></div>}
        </div>
    )
}

function capitalizeFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}