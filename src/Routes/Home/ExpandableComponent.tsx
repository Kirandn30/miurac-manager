import { ExpanderComponentProps } from "react-data-table-component";
import { ProjectDetailsType, ProjectDocumentsType, setProjectDetails } from "../../redux/projectSlice";
import { Text, Badge, Divider, SimpleGrid, Modal, ActionIcon } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useState } from "react";
import { IMAGE_MIME_TYPE, MS_EXCEL_MIME_TYPE, MS_POWERPOINT_MIME_TYPE, MS_WORD_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import pdf from "../../assets/pdf.png"
import word from "../../assets/word.png"
import powerpoint from "../../assets/powerpoint.png"
import excel from "../../assets/excel.png"
import unknown from "../../assets/unknown-mail.png"
import { IconCheck, IconDownload, IconTrash, IconX } from "@tabler/icons-react";
import { IconExternalLink } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux";
import { deleteObject, ref } from "firebase/storage";

export const ExpandedComponent: React.FC<ExpanderComponentProps<ProjectDetailsType>> = ({ data }) => {

    const [viewDocModal, setViewDocModal] = useState<{
        data: ProjectDocumentsType | null, modal: boolean
    }>({ data: null, modal: false })
    const matches = useMediaQuery('(min-width: 767px)');
    const allMimeTypes = [...IMAGE_MIME_TYPE, ...MS_EXCEL_MIME_TYPE, ...MS_POWERPOINT_MIME_TYPE, ...MS_WORD_MIME_TYPE, ...PDF_MIME_TYPE]
    return (
        <div>
            <div className='grid md:grid-cols-4 gap-y-3 p-5'>
                <div className='space-y-3'>
                    <Text className='text-sm font-semibold'>App Structure :</Text>
                    <div className='space-x-3'>
                        {data.appStructure.map(app => (
                            <Badge>{app}</Badge>
                        ))}
                    </div>
                </div>
                <div className='space-y-3'>
                    <Text className='text-sm font-semibold'>Team :</Text>
                    <div className='space-x-3 flex text-xs'>
                        {data.humanResourceRequriments.map(data => (
                            <Text >{data.name},</Text>
                        ))}
                    </div>
                </div>
                <div className='col-span-2 space-y-3'>
                    <div className='flex gap-3'>
                        <Text className='text-sm font-semibold'>Latest Update :</Text>
                        <Text className='text-sm'>{data.latestUpdate[0].update}</Text>
                    </div>
                    <div className='flex gap-3'>
                        <Text className='text-sm font-semibold'>Remarks :</Text>
                        <Text className='text-sm'>{data.remarks[0].remark}</Text>
                    </div>
                </div>
            </div>
            <SimpleGrid cols={matches ? 5 : 3} className="my-3">
                {data.projectDocuments && data.projectDocuments.map(document => (
                    <div className="p-3 shadow-lg mb-3 rounded-lg relative">
                        <div className="max-h-40 overflow-clip">
                            {/* 
                            @ts-ignore */}
                            {IMAGE_MIME_TYPE.includes(document.type) && <img src={document.url} alt={document.name} />}
                            {/* 
                            @ts-ignore */}
                            {PDF_MIME_TYPE.includes(document.type) &&
                                <div className="h-40 bg-slate-100 justify-center items-center rounded-md flex">
                                    <div className="text-center text-xs">
                                        <img src={pdf} alt="pdf" className="h-14 block m-auto" />
                                        <Text className="w-48 my-2 font-semibold">{document.name}</Text>
                                        <Text>{(document.size / 1000000).toFixed(2)}MB</Text>
                                    </div>
                                </div>
                            }
                            {/* 
                            @ts-ignore */}
                            {MS_WORD_MIME_TYPE.includes(document.type) &&
                                <div className="h-40 bg-slate-100 justify-center items-center rounded-md flex">
                                    <div className="text-center text-xs">
                                        <img src={word} alt="pdf" className="h-14 block m-auto" />
                                        <Text className="w-48 my-2 font-semibold">{document.name}</Text>
                                        <Text>{(document.size / 1000000).toFixed(2)}MB</Text>
                                    </div>
                                </div>
                            }
                            {/* 
                            @ts-ignore */}
                            {MS_EXCEL_MIME_TYPE.includes(document.type) &&
                                <div className="h-40 bg-slate-100 justify-center items-center rounded-md flex">
                                    <div className="text-center text-xs">
                                        <img src={excel} alt="pdf" className="h-14 block m-auto" />
                                        <Text className="w-48 my-2 font-semibold">{document.name}</Text>
                                        <Text>{(document.size / 1000000).toFixed(2)}MB</Text>
                                    </div>
                                </div>
                            }
                            {/* 
                            @ts-ignore */}
                            {MS_POWERPOINT_MIME_TYPE.includes(document.type) &&
                                <div className="h-40 bg-slate-100 justify-center items-center rounded-md flex">
                                    <div className="text-center text-xs">
                                        <img src={powerpoint} alt="pdf" className="h-14 block m-auto" />
                                        <Text className="w-48 my-2 font-semibold">{document.name}</Text>
                                        <Text>{(document.size / 1000000).toFixed(2)}MB</Text>
                                    </div>
                                </div>
                            }
                            {/* 
                            @ts-ignore */}
                            {!allMimeTypes.includes(document.type) &&
                                <div className="h-40 bg-slate-100 justify-center items-center rounded-md flex">
                                    <div className="text-center text-xs">
                                        <img src={unknown} alt="pdf" className="h-14 block m-auto" />
                                        <Text className="w-48 my-2 font-semibold">{document.name}</Text>
                                        <Text>{(document.size / 1000000).toFixed(2)}MB</Text>
                                    </div>
                                </div>
                            }

                        </div>
                        <div className="h-full"></div>
                        <DocumentsActions
                            document={document}
                            data={data}
                        />
                    </div>
                ))}
            </SimpleGrid>
            <Divider />
            <Modal
                opened={viewDocModal.modal}
                onClose={() => setViewDocModal({ data: null, modal: false })}
            >

            </Modal>
        </div>
    );
};

export function downloadFile(url: string, filename: string) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const DocumentsActions = ({ document, data }: {
    document: ProjectDocumentsType
    data: ProjectDetailsType
}) => {
    const { user } = useSelector((state: RootState) => state.user)
    const { ProjectsDetails } = useSelector((state: RootState) => state.projectdetails)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    return (
        <div className="absolute bottom-5 right-5 flex gap-x-3 bg-white p-1 rounded-sm">
            <ActionIcon
                variant="light"
                onClick={() => window.open(document.url, '_blank')}
                size="xs"
            >
                <IconExternalLink color="blue" />
            </ActionIcon>
            <ActionIcon
                variant="light"
                onClick={() => downloadFile(document.url, document.name)}
                size="xs"
            >
                <IconDownload color="green" />
            </ActionIcon>
            <ActionIcon
                loading={loading}
                variant="light"
                onClick={async () => {
                    try {
                        if (!user) return
                        const filteredData = data.projectDocuments?.filter(each => each.id !== document.id)
                        if (!filteredData) return
                        setLoading(true)
                        await updateDoc(doc(db, "Projects", data.projectId), {
                            projectDocuments: filteredData
                        })
                        const fileRef = ref(storage, document.path);
                        await deleteObject(fileRef)
                        const updatedArray = ProjectsDetails.map((eachProject) => {
                            if (eachProject.projectId === data.projectId) {
                                return { ...eachProject, projectDocuments: filteredData };
                            }
                            return eachProject;
                        });
                        dispatch(setProjectDetails(updatedArray))
                        showNotification({
                            id: `reg-err-${Math.random()}`,
                            autoClose: 2000,
                            title: 'Success!',
                            message: `Deleted ${document.type} document`,
                            color: 'green',
                            icon: <IconCheck />,
                            loading: false,
                        });
                    } catch (error) {
                        showNotification({
                            id: `reg-err-${Math.random()}`,
                            autoClose: 5000,
                            title: 'Error!',
                            message: `Error deleting ${document.type} document try again`,
                            color: 'red',
                            icon: <IconX />,
                            loading: false,
                        });
                    } finally {
                        setLoading(false)
                    }
                }}
                size="xs"
            >
                <IconTrash color="red" />
            </ActionIcon>
        </div>
    )
}