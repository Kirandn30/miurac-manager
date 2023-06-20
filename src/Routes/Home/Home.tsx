import React, { useEffect, useState } from 'react'
import { Button, Modal, Title } from "@mantine/core"
import { ProjectForm } from './ProjectForm'
import { Actions } from '../../Components/Actions';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { ProjectTableData } from './ProjectTableData';
import { ProjectDetailsType, setProjectDetails } from '../../redux/projectSlice';

export const Home = () => {
    const [opened, setOpened] = useState<{ modal: boolean, data: ProjectDetailsType | null }>({ modal: false, data: null })
    const [filterValue, setFilterValue] = useState<string | null>(null)
    const [filterBy, setfilterBy] = useState<string | null>(null)
    const [filteredData, setFilteredData] = useState<any[] | null>(null)
    const [filterQuries, setFilterQueries] = useState<{ filter: string | null, filter2: string[] }>({ filter: null, filter2: [] })
    const { user } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user) return
        const unsubscribe = onSnapshot(collection(db, "Users", user.uid, "Projects"), async (snapshot) => {
            const projectData = await snapshot.docs.map((doc => ({ ...doc.data() })))
            dispatch(setProjectDetails(projectData));
        })
        return () => unsubscribe()
    }, [])


    return (
        <div className='float-right'>
            <Button variant='filled' onClick={() => setOpened(op => ({ ...op, data: null, modal: true }))}>Create Charter</Button>
            <Modal
                opened={opened.modal}
                onClose={() => setOpened({ data: null, modal: false })}
                size={900}
                title={<Title order={2} align='center'>Create contract</Title>}
                classNames={{ title: "w-full" }}
                centered
                fullScreen
            >
                <ProjectForm projectDetails={opened.data} />
            </Modal>
            <div className='p-3'>
                <Actions
                    searchData={searchData}
                    setFilterValue={setFilterValue}
                    setfilterBy={setfilterBy}
                    filterBy={filterBy}
                    filterValue={filterValue}
                    filterData={filterData}
                    setFilterQueries={setFilterQueries}
                />
                <ProjectTableData setOpened={setOpened} />
            </div>
        </div>
    )
}


const searchData = [
    {
        label: "Name",
        value: "searchableName",
    },
    {
        label: "Email",
        value: "searchableEmail",
    },
    {
        label: "Phone Number",
        value: "phoneNumber",
    },
    {
        label: "Company Name",
        value: "searchableCompanyName",
    }
]

const filterData = {
    data1: [
        {
            label: "Paid",
            value: "paid",
        },
        {
            label: "Created",
            value: "created",
        },
    ]
}