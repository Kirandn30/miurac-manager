import React, { useState } from 'react'
import { Modal, Title } from "@mantine/core"
import { ProjectForm } from './ProjectForm'
import { TableHeader } from '../../Components/Actions';
import { ProjectTableData } from './ProjectTableData';
import { ProjectDetailsType } from '../../redux/projectSlice';
import { connectHits } from "react-instantsearch-dom"

export const Home = () => {
    const [opened, setOpened] = useState<{ modal: boolean, data: ProjectDetailsType | null }>({ modal: false, data: null })
    const CustomHits = connectHits(ProjectTableData);

    return (
        <div className='bg-white rounded-xl overflow-clip md:m-5 shadow-md'>
            <Modal
                opened={opened.modal}
                onClose={() => setOpened({ data: null, modal: false })}
                title={<Title order={2} align='center'>{opened.data ? "Edit contract" : "Create contract"}</Title>}
                classNames={{ title: "w-full" }}
                fullScreen
            >
                <ProjectForm
                    projectDetails={opened.data}
                    setOpened={setOpened}
                />
            </Modal>
            <div className='md:p-3'>
                <TableHeader setOpened={setOpened} />
                <CustomHits
                    setOpened={setOpened}
                />
            </div>
        </div>
    )
};