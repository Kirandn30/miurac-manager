import { Button, Checkbox, Popover, Radio, Group } from '@mantine/core'
import { IconFilter } from '@tabler/icons-react';
import React, { useState } from 'react'

export const EventsFilter = ({ filterData, setFilterQueries }: {
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
    const [value, setValue] = useState<string>(String(filterData.data1[0].value));
    const [value2, setValue2] = useState<string[]>([]);
    const [opened, setOpened] = useState(false);
    return (
        <Popover
            shadow="lg"
            width={250}
            opened={opened}
            position="bottom"
            withArrow
        >
            <Popover.Target>
                <Button variant='outline' color='gray' className='text-black' bg="white" onClick={() => setOpened((o) => !o)}>
                    <span className='font-semibold'>Filter &nbsp;</span><IconFilter />
                </Button>
            </Popover.Target>
            <Popover.Dropdown className={filterData.data2 ? "p-5" : "mt-5"}>
                <div className=''>
                    <div className={filterData.data2 ? 'grid grid-cols-2' : 'grid'}>
                        <div className='flex justify-center'>
                            <Radio.Group
                                value={value}
                                onChange={(e) => { setValue(e); setValue2([]) }}
                            >
                                <Group mt="xs" className=''>
                                    {filterData.data1.map((data, index) => (
                                        <Radio key={index} value={String(data.value)} label={data.label} />
                                    ))}
                                </Group>
                            </Radio.Group>
                        </div>
                        <div className=''>
                            <Checkbox.Group
                                className='my-3'
                                withAsterisk
                                value={value2}
                                onChange={setValue2}
                            >
                                {filterData.data2?.filter((item) => item.type === value).map((data, index) => (
                                    <Checkbox key={index} value={data.value} label={data.label} />
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>
                    <div className='flex justify-center gap-5 my-5'>
                        <Button
                            onClick={() => {
                                setFilterQueries({ filter: null, filter2: [] })
                                setValue2([])
                                setOpened(false)
                            }}
                            size='xs'
                            variant='outline'>Clear</Button>
                        <Button size='xs'
                            onClick={async () => {
                                setFilterQueries({ filter: value, filter2: value2 })
                                setOpened(false)
                            }}
                        >Apply</Button>
                    </div>
                </div>
            </Popover.Dropdown>
        </Popover>
    )
}