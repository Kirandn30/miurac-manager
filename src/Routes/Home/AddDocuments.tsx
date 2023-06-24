import { Dropzone } from '@mantine/dropzone'
import { Text, Button, ActionIcon } from "@mantine/core"
import React, { useState } from 'react'
import { IconUpload, IconX } from '@tabler/icons-react'
import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';
import uploadAndGetURL from '../../Hooks/useStorage';
import { ProjectDetailsType, setProjectDetails } from '../../redux/projectSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const AddDocuments = ({ projectData, setDocumentsModal }: {
    projectData: ProjectDetailsType | null
    setDocumentsModal: React.Dispatch<React.SetStateAction<{
        data: ProjectDetailsType | null;
        modal: boolean;
    }>>

}) => {
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<{ id: string, file: File, type: string, size: number, name: string }[]>([])
    const { user } = useSelector((state: RootState) => state.user)
    const { ProjectsDetails } = useSelector((state: RootState) => state.projectdetails)
    const dispatch = useDispatch()
    return (
        <div>
            <Dropzone
                maxFiles={5}
                maxSize={10000000}
                onDrop={(files) => {
                    const data = files.map(file => {
                        const id = uuidv4();
                        const type = file.type;
                        const size = file.size;
                        const name = file.name
                        return { id, file, type, size, name }
                    })
                    setFiles(data);
                }}
                className='h-48'
                loading={loading}
            >
                <div className='text-gray-400'>
                    <div className='grid justify-center gap-y-3 h-full items-center'>
                        <div className='flex justify-center'>
                            <IconUpload size={40} />
                        </div>
                        <Text size={16}>Drop files here</Text>
                    </div>
                    <Text align='center' className='font-bold' size={12}>OR</Text>
                    <Text align='center' size={16}>Browse files</Text>
                </div>
            </Dropzone>
            <div className='grid grid-cols-3 my-3'>
                <div></div>
                <div className='col-span-2 grid grid-cols-2 gap-x-3'>
                    <Button variant='outline' onClick={() => {
                        setFiles([])
                        setDocumentsModal({ data: null, modal: false })
                    }}>Cancel</Button>
                    <Button
                        disabled={files.length > 0 ? false : true}
                        loading={loading}
                        onClick={async () => {
                            try {
                                if (!projectData || !user) return
                                setLoading(true)
                                const urls = await Promise.all(files.map(async (file) => {
                                    const url = await uploadAndGetURL(`${user.uid}/projects/${projectData.projectId}/${file.id}.${file.file.type}`, file.file);
                                    return { id: file.id, url: url, type: file.type, size: file.size, name: file.name, path: `${user.uid}/projects/${projectData.projectId}/${file.id}.${file.file.type}` };
                                }));
                                const updatedProjectDocs = projectData.projectDocuments !== undefined
                                    ? [...projectData.projectDocuments, ...urls]
                                    : [...urls]
                                await updateDoc(doc(db, "Projects", projectData.projectId), {
                                    projectDocuments: updatedProjectDocs
                                })
                                const updatedArray = ProjectsDetails.map((eachProject) => {
                                    if (eachProject.projectId === projectData.projectId) {
                                        return { ...eachProject, projectDocuments: updatedProjectDocs };
                                    }
                                    return eachProject;
                                });
                                dispatch(setProjectDetails(updatedArray))
                                setFiles([])
                                setDocumentsModal({ data: null, modal: false })
                            } catch (error) {
                                showNotification({
                                    id: `reg-err-${Math.random()}`,
                                    autoClose: 5000,
                                    title: 'Error!',
                                    message: "Error saving documents try again",
                                    color: 'red',
                                    icon: <IconX />,
                                    loading: false,
                                });
                            } finally {
                                setLoading(true)
                            }
                        }}
                    >Upload</Button>
                </div>
            </div>
            <div className='space-y-1'>
                {files.map(folder => (
                    <div>
                        <div className='text-xs p-1 border-dashed border-gray-300 border-[1px] flex'>
                            <Text className='grow max-w-xs text-ellipsis overflow-hidden whitespace-nowrap'>{folder.file.name}</Text>
                            <ActionIcon size="xs" className='absolute right-0'
                                onClick={() => setFiles(prev => {
                                    const newData = prev.filter(file => file.id !== folder.id)
                                    return newData
                                })}
                            >
                                <IconX color='red' />
                            </ActionIcon>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
