import React, { useEffect, useState } from 'react'
import DataTable, { ExpanderComponentProps } from 'react-data-table-component'
import { Text, Badge, Menu, ActionIcon, Divider, LoadingOverlay, Pagination, Button, Modal, Title } from "@mantine/core"
import spacetime from 'spacetime'
import { ProjectDetailsType, setProjectDetails } from '../../redux/projectSlice'
import { DocumentData, DocumentSnapshot, Query, collection, doc, getCountFromServer, getDocs, limit, orderBy, query, startAfter, startAt, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { IconCheck, IconDots, IconDownload, IconPencil, IconSquareRoundedPlus, IconTrash, IconX } from '@tabler/icons-react'
import Lottie from 'react-lottie';
import animationData from "../../assets/jsons/emptyfile.json"
import { AddDocuments } from './AddDocuments'
import { ExpandedComponent } from './ExpandableComponent'
import { showNotification } from '@mantine/notifications'
import { PaginationComponent } from '../../Components/Pagination/Pagination'

export const ProjectTableData = ({
    setOpened,
    hits,
}: {
        setOpened: React.Dispatch<
            React.SetStateAction<{
                modal: boolean;
                data: ProjectDetailsType | null;
            }>
        >;
        hits: any;
}) => {
    const { user } = useSelector((state: RootState) => state.user)
    const { shouldFetch } = useSelector((state: RootState) => state.Search)
    const { ProjectsDetails } = useSelector((state: RootState) => state.projectdetails)
    const [loading, setLoading] = useState(true);
    const pageSize = 10; // Number of items per page
    const [totalDocs, setTotalDocs] = useState(0)
    const [pageSnapshotsEnd, setPageSnapshotsEnd] = useState<DocumentSnapshot<DocumentData>[]>([]);
    const [pageSnapshotsStart, setPageSnapshotsStart] = useState<DocumentSnapshot<DocumentData>[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState(1)
    const [documentsModal, setDocumentsModal] = useState<{
        data: ProjectDetailsType | null,
        modal: boolean
    }>({ data: null, modal: false })
    const dispatch = useDispatch()
    const statuses = ["New"]



    const onPageChange = async (pageNumber: number) => {
        if (!user) return
        setLoading(true);
        const docRef = collection(db, "Projects"); // replace with your collection name
        let dataQuery: Query<DocumentData> | null;
        if (pageNumber === 1) {
            dataQuery = query(docRef, where("userId", "==", user.uid), where("status", "in", statuses), orderBy("createdAt", "desc"), limit(pageSize)); // replace "field - to - order" with the field to sort by
        } else if (pageNumber > page) {
            dataQuery = query(docRef, where("userId", "==", user.uid), where("status", "in", statuses), orderBy("createdAt", "desc"), startAfter(pageSnapshotsEnd[pageNumber - 2]), limit(pageSize));
        } else if (pageNumber < page) {
            dataQuery = query(docRef, where("userId", "==", user.uid), where("status", "in", statuses), orderBy("createdAt", "desc"), startAt(pageSnapshotsStart[pageNumber - 1]), limit(pageSize));
        } else {
            dataQuery = null
        }
        if (!dataQuery) return
        const querySnapshot = await getDocs(dataQuery);
        const newData = querySnapshot.docs.map(doc => doc.data()) as ProjectDetailsType[]
        const newPageSnapshots = [...pageSnapshotsEnd];
        const newPageSnapshots2 = [...pageSnapshotsStart];
        newPageSnapshots[pageNumber - 1] = querySnapshot.docs[querySnapshot.docs.length - 1];
        newPageSnapshots2[pageNumber - 1] = querySnapshot.docs[0];
        console.log(newPageSnapshots);
        setPageSnapshotsEnd(newPageSnapshots);
        setPageSnapshotsStart(newPageSnapshots2);
        dispatch(setProjectDetails(newData))
        setPage(pageNumber);
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            if (!user) return
            const docRef = collection(db, "Projects");
            const q = query(docRef, where("status", "in", statuses), where("userId", "==", user.uid))
            const snapshot = await getCountFromServer(q);
            setTotalDocs(snapshot.data().count);
            onPageChange(pageNumber);
        })()
    }, [])

    useEffect(() => {
        if (ProjectsDetails.length === 0) return
        onPageChange(pageNumber);
    }, [pageNumber])


    const columns = [
        {
            name: 'Filed on',
            cell: (row: ProjectDetailsType) => {
                try {
                    return (
                        //@ts-ignore
                        <Text className='text-xs font-medium'>{spacetime(shouldFetch ? new Date(row.createdAt) : row.createdAt?.toDate()).format("nice").replace(",", " -")}</Text>
                    )
                } catch (error) {
                    return (
                        //@ts-ignore
                        <Text className='text-xs font-medium'>{spacetime(new Date(row.createdAt)).format("nice").replace(",", " -")}</Text>
                    )
                }
            }
        },
        {
            name: 'Client Name',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.clientName}
                    </Text>
                )
            }
        },
        {
            name: 'Company',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.clientCompany}
                    </Text>
                )
            }
        },
        {
            name: 'Project Name',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        {row.projectName}
                    </Text>
                )
            }
        },
        {
            name: 'Budget Estimation',
            cell: (row: ProjectDetailsType) => {
                return (
                    <Text className='text-xs'>
                        ₹{row.estimatedBudject?.reduce((a, b) => a + Number(b.estdCost), 0)}
                    </Text>
                )
            }
        },
        {
            name: 'Status',
            cell: (row: ProjectDetailsType) => {
                return (
                    <div>
                        <Badge className=''>{row.status}</Badge>
                    </div>
                )
            }
        },
        {
            name: 'Action',
            cell: (row: ProjectDetailsType) => {
                return (
                    <div>
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <ActionIcon
                                    size="md"
                                    variant='transparent'
                                >
                                    <IconDots color='black' />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item onClick={() => setOpened({ data: row, modal: true })} icon={<IconPencil size={14} />}>Edit</Menu.Item>
                                <Menu.Item icon={<IconSquareRoundedPlus size={14} />} onClick={() => setDocumentsModal({ data: row, modal: true })}>Add Documents</Menu.Item>
                                <Menu.Item icon={<IconDownload size={14} />}>Download</Menu.Item>
                                <Menu.Item
                                    icon={<IconTrash size={14} />}
                                    onClick={async () => {
                                        try {
                                            if (!user) return
                                            await updateDoc(doc(db, "Projects", row.projectId), {
                                                status: "deleted"
                                            })
                                            const filteredProjects = ProjectsDetails.filter(each => each.projectId !== row.projectId)
                                            dispatch(setProjectDetails(filteredProjects))
                                            showNotification({
                                                id: `reg-err-${Math.random()}`,
                                                autoClose: 5000,
                                                title: 'Success!',
                                                message: `${row.projectName} project deleted`,
                                                color: 'green',
                                                icon: <IconCheck />,
                                                loading: false,
                                            });
                                        } catch (error) {
                                            showNotification({
                                                id: `reg-err-${Math.random()}`,
                                                autoClose: 5000,
                                                title: 'Error!',
                                                message: `Error deleting ${row.projectName} project try again`,
                                                color: 'red',
                                                icon: <IconX />,
                                                loading: false,
                                            });
                                        }
                                    }}
                                >Delete</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                )
            }
        },
    ];

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className=''>
            <Modal
                opened={documentsModal.modal}
                onClose={() => setDocumentsModal({ data: null, modal: false })}
                title={<Title order={3} align='center'>Upload files</Title>}
                centered
            >
                <div className='p-5'>
                    <AddDocuments
                        projectData={documentsModal.data}
                        setDocumentsModal={setDocumentsModal}
                    />
                </div>
            </Modal>
            {
                shouldFetch ? (
                    <DataTable
                        data={hits}
                        columns={columns}
                        fixedHeader
                        customStyles={customStyles}
                        // selectableRows
                        expandableRows
                        expandableRowsComponent={ExpandedComponent}
                    />
                ) : (
                    <div>
                            <DataTable
                                data={ProjectsDetails}
                                columns={columns}
                                fixedHeader
                                customStyles={customStyles}
                                expandableRows
                                expandableRowsComponent={ExpandedComponent}
                                onChangePage={onPageChange}
                                paginationServer
                                progressPending={loading}
                                progressComponent={<LoadingOverlay visible />}
                                highlightOnHover
                                responsive
                                className='h-[680px]'
                                noDataComponent={
                                    <div>
                                        <Lottie
                                            options={defaultOptions}
                                            height={300}
                                            width={400}
                                        />
                                        <div className='flex justify-center pb-10'>
                                            <Button
                                                onClick={() => setOpened({ data: null, modal: true })}
                                            >Create Project</Button>
                                        </div>
                                    </div>
                                }
                            />
                            {ProjectsDetails.length > 0 &&
                                <div className='fixed md:bottom-0 bottom-16 z-50 w-full bg-white m-auto p-3 rounded-lg flex justify-center'>
                                    {/* <Pagination
                                        total={Math.ceil(totalDocs / 10)}
                                        value={pageNumber}
                                        onChange={(a) => setPageNumber(a)}
                                    /> */}
                                    <PaginationComponent
                                        totalDocs={totalDocs}
                                        pageNumber={pageNumber}
                                        setPageNumber={setPageNumber}
                                    />
                            </div>}
                    </div>
                )
            }
        </div>
    )
}

//  Internally, customStyles will deep merges your customStyles with the default styling.
const customStyles = {
    rows: {
        style: {
            minHeight: '60px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            fontWeight: 700,
            fontSize: "14px",
            color: "#565D6D"
        },
    },
    cells: {
        style: {
            paddingLeft: "8px", // override the cell padding for data cells
            paddingRight: "8px",
        },
    },
    headRow: {
        style: {
            backgroundColor: "#F3F4F6",
            minHeight: '52px',
            borderBottomWidth: '1px',
            borderBottomColor: "#e6e6e6",
            borderBottomStyle: 'solid',
            // borderRadius: "10px",
            padding: "10px 0px"
        },
    },
};
