import React, { useEffect, useState } from 'react'
import { Modal, Title } from "@mantine/core"
import { ProjectForm } from './ProjectForm'
import { TableHeader } from '../../Components/Actions';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { ProjectTableData } from './ProjectTableData';
import { ProjectDetailsType, setProjectDetails } from '../../redux/projectSlice';
import { connectHits } from "react-instantsearch-dom"

export const Home = () => {
    const [opened, setOpened] = useState<{ modal: boolean, data: ProjectDetailsType | null }>({ modal: false, data: null })
    const { user } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()


    useEffect(() => {
        if (!user) return
        const unsubscribe = onSnapshot(query(collection(db, "Users", user.uid, "Projects"), orderBy("createdAt", "desc"), limit(10)), (snapshot) => {
            const projectData = snapshot.docs.map((doc => ({ ...doc.data() })))
            dispatch(setProjectDetails(projectData));
        })
        return () => unsubscribe()
    }, [])


    const CustomHits = connectHits(ProjectTableData);

    return (
        <div className='bg-white rounded-xl overflow-clip m-5 shadow-md'>
            <Modal
                opened={opened.modal}
                onClose={() => setOpened({ data: null, modal: false })}
                size={900}
                title={<Title order={2} align='center'>Create contract</Title>}
                classNames={{ title: "w-full" }}
                centered
                fullScreen
            >
                <ProjectForm projectDetails={opened.data} setOpened={setOpened} />
            </Modal>
            <div className='md:p-3'>
                <TableHeader setOpened={setOpened} />
                <CustomHits setOpened={setOpened} />
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