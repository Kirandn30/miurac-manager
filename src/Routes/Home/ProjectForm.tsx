import { Button, TextInput, MultiSelect, Textarea, Group, ActionIcon, Text } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconTrash, IconX } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup'
import React, { useEffect, useState } from 'react'
import { showNotification } from '@mantine/notifications';
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { ProjectDetailsType } from '../../redux/projectSlice';

const projectSchema = Yup.object().shape({
    projectName: Yup.string().required('Project name is required'),
    clientCompany: Yup.string().required('Client company is required'),
    clientPhone: Yup.string()
        .required('Client phone number is required')
        .matches(/^\d{10}$/, 'Invalid phone number format'),
    clientEmail: Yup.string().email('Invalid email address').required('Client email is required'),
    appStructure: Yup.array().min(1, 'At least one app structure item is required'),
});

export const ProjectForm = ({ projectDetails, setOpened }: {
    projectDetails: ProjectDetailsType | null
    setOpened: React.Dispatch<React.SetStateAction<{
        modal: boolean;
        data: ProjectDetailsType | null;
    }>>

}) => {
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (!projectDetails) return
        form.setValues(projectDetails)
    }, [])

    const form = useForm<FormType>({
        initialValues: {
            projectName: "",
            clientCompany: "",
            clientName: "",
            clientPhone: "",
            clientEmail: "",
            address: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
            appStructure: [],
            projectDescription: '',
            deliverables: [{ deliverable: '', id: uuidv4() }],
            assumptions: '',
            businessObjectives: '',
            businessScope: '',
            completionCriteria: '',
            constraints: '',
            estimatedBudject: [{
                resourceDiscription: '',
                estdCost: '',
                id: uuidv4()
            }],
            estimatedSchedule: [{
                projectMileStores: '',
                time: '',
                id: uuidv4()
            }],
            procurements: [{
                discription: '',
                source: '',
                estdCost: '',
                id: uuidv4()
            }],
            projectSuccessDiscription: '',
            risks: '',
            humanResourceRequriments: [{
                name: '',
                department: '',
                contact: '',
                id: uuidv4()
            }]
        },
        validate: yupResolver(projectSchema)
    });

    const procurementsFields = form.values.procurements.map((item, index) => (
        <Group key={item.id} mt="xs">
            <TextInput
                placeholder="Database, robust"
                label="Description"
                sx={{ flex: 1 }}
                {...form.getInputProps(`procurements.${index}.discription`)}
            />
            <TextInput
                placeholder="Implementation of a responsive customer support system,"
                label="Source"
                sx={{ flex: 1 }}
                {...form.getInputProps(`procurements.${index}.source`)}
            />
            <TextInput
                placeholder="Implementation of a responsive customer support system,"
                label="Estd cost"
                sx={{ flex: 1 }}
                {...form.getInputProps(`procurements.${index}.estdCost`)}
            />
            <ActionIcon color="red" onClick={() => form.removeListItem('procurements', index)}>
                <IconTrash size="1rem" />
            </ActionIcon>
        </Group>
    ));


    const humanResourceRequrimentsFields = form.values.humanResourceRequriments.map((item, index) => (
        <Group key={item.id} mt="xs">
            <TextInput
                placeholder="Database, robust"
                sx={{ flex: 1 }}
                {...form.getInputProps(`humanResourceRequriments.${index}.name`)}
                label="Name"
            />
            <TextInput
                placeholder="Database, robust"
                label="Department"
                sx={{ flex: 1 }}
                {...form.getInputProps(`humanResourceRequriments.${index}.department`)}
            />
            <TextInput
                label="Contact"
                placeholder="Implementation of a responsive customer support system,"
                sx={{ flex: 1 }}
                {...form.getInputProps(`humanResourceRequriments.${index}.contact`)}
            />
            <ActionIcon color="red" onClick={() => form.removeListItem('humanResourceRequriments', index)}>
                <IconTrash size="1rem" />
            </ActionIcon>
        </Group>
    ));

    const estimatedBudjectFields = form.values.estimatedBudject.map((item, index) => (
        <Group key={item.id} mt="xs">
            <TextInput
                placeholder="Database, robust"
                sx={{ flex: 1 }}
                {...form.getInputProps(`estimatedBudject.${index}.resourceDiscription`)}
                label="Resource Description"
            />
            <TextInput
                label="Estd cost"
                placeholder="Implementation of a responsive customer support system,"
                sx={{ flex: 1 }}
                {...form.getInputProps(`estimatedBudject.${index}.estdCost`)}
            />
            <ActionIcon color="red" onClick={() => form.removeListItem('estimatedBudject', index)}>
                <IconTrash size="1rem" />
            </ActionIcon>
        </Group>
    ));

    const estimatedScheduleFields = form.values.estimatedSchedule.map((item, index) => (
        <Group key={item.id} mt="xs">
            <TextInput
                placeholder="Database, robust"
                sx={{ flex: 1 }}
                {...form.getInputProps(`estimatedSchedule.${index}.projectMileStores`)}
                label="Project milestones"
            />
            <TextInput
                placeholder="Implementation of a responsive customer support system,"
                sx={{ flex: 1 }}
                {...form.getInputProps(`estimatedSchedule.${index}.time`)}
                label="Time"
            />
            <ActionIcon color="red" onClick={() => form.removeListItem('estimatedSchedule', index)}>
                <IconTrash size="1rem" />
            </ActionIcon>
        </Group>
    ));

    const deliverablesFields = form.values.deliverables.map((item, index) => (
        <Group key={item.id} mt="xs">
            <TextInput
                placeholder="The development and design of a user-friendly meat app"
                withAsterisk
                sx={{ flex: 1 }}
                {...form.getInputProps(`deliverables.${index}.deliverable`)}
            />
            <ActionIcon color="red" onClick={() => form.removeListItem('deliverables', index)}>
                <IconTrash size="1rem" />
            </ActionIcon>
        </Group>
    ));

    return (
        <div>
            <div className='md:p-5 md:mx-28'>
                <form
                    onSubmit={form.onSubmit(async (val) => {
                        if (projectDetails) {
                            try {
                                if (!user) return
                                setLoading(true)
                                await updateDoc(doc(db, "Users", user.uid, "Projects", projectDetails.projectId), {
                                    ...val,
                                })
                                setOpened(prev => ({ ...prev, data: null, modal: false }))
                            } catch (error) {
                                showNotification({
                                    id: `reg-err-${Math.random()}`,
                                    autoClose: 5000,
                                    title: 'Error!',
                                    message: "Error saving details try again",
                                    color: 'red',
                                    icon: <IconX />,
                                    loading: false,
                                });
                            } finally {
                                setLoading(false)
                            }
                        } else {
                            try {
                                if (!user) return
                                setLoading(true)
                                const projectId = uuidv4()
                                const docRef = collection(db,'users')
                                await setDoc(doc(db, "Users", user.uid, "Projects", projectId), {
                                    ...val,
                                    projectId,
                                    createdAt:serverTimestamp(),
                                    status: "New"
                                })
                                setOpened(prev => ({ ...prev, data: null, modal: false }))
                            } catch (error) {
                                showNotification({
                                    id: `reg-err-${Math.random()}`,
                                    autoClose: 5000,
                                    title: 'Error!',
                                    message: "Error saving details try again",
                                    color: 'red',
                                    icon: <IconX />,
                                    loading: false,
                                });
                            } finally {
                                setLoading(false)
                            }
                        }
                    })}
                >
                    <TextInput
                        className='my-2'
                        label="Project Name"
                        name="Project Name"
                        {...form.getInputProps("projectName")}
                        placeholder='Project Name'
                        withAsterisk
                    />
                    <div className='grid grid-cols-2 gap-x-5'>
                        <div>
                            <TextInput
                                className='my-2'
                                label="Client Company"
                                name="Client Company"
                                {...form.getInputProps("clientCompany")}
                                placeholder='Client Company'
                                withAsterisk
                            />
                            <TextInput
                                className='my-2'
                                label="Client Name"
                                name="Client Name"
                                {...form.getInputProps("clientName")}
                                placeholder='Client Name'
                                withAsterisk
                            />
                            <TextInput
                                className='my-2'
                                label="Client Phone"
                                name="Client Phone"
                                {...form.getInputProps("clientPhone")}
                                placeholder='Client Phone'
                                withAsterisk
                            />
                            <TextInput
                                className='my-2'
                                label="Client Email"
                                name="Client Email"
                                {...form.getInputProps("clientEmail")}
                                placeholder='Client Email'
                                withAsterisk
                            />
                            <TextInput
                                className='my-2'
                                label="Address"
                                name="Address"
                                {...form.getInputProps("address")}
                                placeholder='Address'
                                withAsterisk
                            />
                        </div>
                        <div>
                            <TextInput
                                className='my-2'
                                label="City"
                                name="City"
                                {...form.getInputProps("city")}
                                placeholder='City'
                                withAsterisk
                            />
                            <TextInput
                                className='my-2'
                                label="State"
                                name="State"
                                {...form.getInputProps("state")}
                                placeholder='State'
                                withAsterisk
                            />
                            <TextInput
                                className='my-2'
                                label="Country"
                                name="Country"
                                {...form.getInputProps("country")}
                                placeholder='Country'
                                withAsterisk
                            />
                            <TextInput
                                className='my-2'
                                label="ZipCode"
                                name="ZipCode"
                                {...form.getInputProps("zipCode")}
                                placeholder='ZipCode'
                                withAsterisk
                            />
                        </div>
                    </div>
                    <MultiSelect
                        data={data}
                        className='my-2'
                        label="Project Type"
                        name="Project Type"
                        {...form.getInputProps("appStructure")}
                        placeholder='Select Project Types'
                    />
                    <Textarea
                        minRows={7}
                        className='my-2'
                        label="Describe the project"
                        name="Describe the project"
                        {...form.getInputProps("projectDescription")}
                        placeholder='The project is a meat app that aims to transform the meat industry by providing a user-friendly digital platform for consumers to conveniently access high-quality, ethically sourced meat products. With a focus on transparency, sustainability, and exceptional customer experience, the app aims to revolutionize the way people engage with meat purchasing. It will offer detailed information about product origins and production methods, foster collaborations with local farmers and suppliers, promote sustainable practices, and deliver personalized recommendations and exceptional customer service. Ultimately, the project seeks to establish itself as the go-to destination for individuals seeking convenient, trustworthy, and environmentally conscious meat options.'
                    />
                    <Textarea
                        className='my-2'
                        label="Business Objectives"
                        name="Business Objectives"
                        {...form.getInputProps("businessObjectives")}
                        placeholder='The primary objective of the meat app is to revolutionize the way consumers engage with the meat industry by providing a seamless digital platform that offers convenience, transparency, and exceptional customer experience. Our aim is to establish the app as the go-to destination for individuals seeking high-quality, ethically sourced meat products, while fostering trust and promoting sustainable practices within the industry.'
                        minRows={4}
                    />
                    <Textarea
                        className='my-2'
                        label="Business Scope"
                        name="Business Scope"
                        {...form.getInputProps("businessScope")}
                        placeholder="The scope of the meat app project encompasses the development, launch, and maintenance of a digital platform that enables consumers to access and purchase high-quality, ethically sourced meat products. The app will provide a user-friendly interface for browsing and ordering, incorporating features such as detailed product information, personalized recommendations, order tracking, and responsive customer support. It will prioritize transparency by providing information about product origins, production methods, and quality standards. The project will also involve establishing partnerships with local farmers and suppliers who share the commitment to sustainability and animal welfare. The scope includes the development of a reliable and efficient supply chain to ensure the consistent delivery of fresh meat products. The maintenance phase will involve ongoing app updates, continuous supplier collaborations, and customer engagement to enhance the platform's functionality, expand the product offerings, and improve the overall customer experience. The scope of the project is focused on providing exceptional convenience, transparency, and customer satisfaction, while promoting sustainable practices within the meat industry."
                        minRows={11}
                    />
                    <div className='my-2 space-y-3 bg-gray-100 md:p-5 p-3 rounded-md'>
                        <Text>Deliverables</Text>
                        {deliverablesFields}
                        <Button
                            className='self-end'
                            variant='outline'
                            size='xs'
                            onClick={() =>
                                form.insertListItem('deliverables', { deliverable: '', id: uuidv4() })
                            }
                        >
                            Add More
                        </Button>
                    </div>
                    <div className='my-2 space-y-3 bg-gray-100 md:p-5 p-3 rounded-md'>
                        <Text>Estimated Schedule</Text>
                        {estimatedScheduleFields}
                        <Button
                            variant='outline'
                            size='xs'
                            onClick={() =>
                                form.insertListItem('estimatedSchedule', {
                                    projectMileStores: '',
                                    time: '',
                                    id: uuidv4()
                                })
                            }
                        >
                            Add More
                        </Button>
                    </div>
                    <div className='my-2 space-y-3 bg-gray-100 md:p-5 p-3 rounded-md'>
                        <Text>Estimated Budget</Text>
                        {estimatedBudjectFields}
                        <Button
                            className='self-end'
                            variant='outline'
                            size='xs'
                            onClick={() =>
                                form.insertListItem('estimatedBudject', {
                                    resourceDiscription: '',
                                    estdCost: '',
                                    id: uuidv4()
                                })
                            }
                        >
                            Add More
                        </Button>
                    </div>
                    <div className='my-2 space-y-3 bg-gray-100 md:p-5 p-3 rounded-md'>
                        <Text>Human Resource Requirements</Text>
                        {humanResourceRequrimentsFields}
                        <Button
                            className='self-end'
                            variant='outline'
                            size='xs'
                            onClick={() =>
                                form.insertListItem('humanResourceRequriments', {
                                    name: '',
                                    department: '',
                                    contact: '',
                                    id: uuidv4()
                                })
                            }
                        >
                            Add More
                        </Button>
                    </div>
                    <div className='my-2 space-y-3 bg-gray-100 md:p-5 p-3 rounded-md'>
                        <Text>Procurements</Text>
                        {procurementsFields}
                        <Button
                            className='self-end'
                            variant='outline'
                            size='xs'
                            onClick={() =>
                                form.insertListItem('procurements', {
                                    discription: '',
                                    source: '',
                                    estdCost: '',
                                    id: uuidv4()
                                })
                            }
                        >
                            Add More
                        </Button>
                    </div>
                    <Textarea
                        className='my-2'
                        label="Risks"
                        name="Risks"
                        {...form.getInputProps("risks")}
                        placeholder='From a high-level perspective, identify project risks and provide some analysis. '
                    />
                    <Textarea
                        className='my-2'
                        label="Completion Criteria"
                        name="Completion Criteria"
                        {...form.getInputProps("completionCriteria")}
                        placeholder='What must occur before the project is considered complete?'
                    />
                    <Textarea
                        className='my-2'
                        label="Define Project Success"
                        name="Define Project Success"
                        {...form.getInputProps("projectSuccessDiscription")}
                        placeholder='What specific measurable objectives must the project achieve to be considered successful?'
                    />
                    <Textarea
                        className='my-2'
                        label="Assumptions"
                        name="Assumptions"
                        {...form.getInputProps("assumptions")}
                        placeholder='List the project assumptions.'
                    />
                    <Textarea
                        className='my-2'
                        label="Constraints"
                        name="Constraints"
                        {...form.getInputProps("constraints")}
                        placeholder='List the project Constraints.'
                    />
                    <div
                        // className='fixed bottom-0 z-50 max-w-sm bg-white rounded-t-md p-2 left-1/2 -translate-x-1/2'
                        className='flex justify-center'
                    >
                        <Button loading={loading} type='submit'>{projectDetails ? "Update" : "Submit"}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

interface FormType {
    projectName: string;
    clientCompany: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    appStructure: string[];
    deliverables: { deliverable: string, id: string }[];
    projectDescription: string;
    businessObjectives: string;
    businessScope: string;
    estimatedSchedule: EstimatedScheduleType[];
    estimatedBudject: EstimatedBudjectType[];
    procurements: ProcurementsType[];
    risks: string;
    completionCriteria: string;
    projectSuccessDiscription: string;
    assumptions: string;
    constraints: string;
    humanResourceRequriments: HumanResourceRequrimentsType[]
}

interface HumanResourceRequrimentsType {
    name: string;
    department: string,
    contact: string,
    id: string
}

interface EstimatedScheduleType {
    projectMileStores: string;
    time: string;
    id: string
}

interface EstimatedBudjectType {
    resourceDiscription: string;
    estdCost: string;
    id: string
}

interface ProcurementsType {
    discription: string;
    source: string;
    estdCost: string;
    id: string
}

const data = [
    {
        label: "Super Admin",
        value: "superAdmin"
    },
    {
        label: "Admin",
        value: "admin"
    },
    {
        label: "Employee",
        value: "employee"
    },
    {
        label: "Merchant",
        value: "merchant"
    },
    {
        label: "User",
        value: "user"
    },
]