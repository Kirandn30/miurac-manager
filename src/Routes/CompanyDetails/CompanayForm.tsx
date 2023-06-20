
import { TextInput, Title, Button, Image, ActionIcon, Text } from '@mantine/core';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import image from "../../assets/page2.png"
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { IconUpload, IconX } from '@tabler/icons-react';
import { showNotification } from '@mantine/notifications';
import { signOut } from 'firebase/auth';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import uploadAndGetURL from '../../Hooks/useStorage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux';
import { setCompanyDetails } from '../../redux/userSlice';

interface CompanayFormType {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    companyLogo: File
}

export default function CompanayForm() {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<File[] | null>(null)
    const { user } = useSelector((state: RootState) => state.user)
    const dipatch = useDispatch()
    const form = useForm<CompanayFormType>({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            city: "",
            state: "",
            country: "",
            companyLogo: new File([], 'company-logo.jpg')
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            name: (value) => value.length > 3 ? null : 'Name is requried',
            phone: (value) => value.length > 3 ? null : 'Phone is requried',
            address: (value) => value.length > 3 ? null : 'Address is requried',
            city: (value) => value.length > 3 ? null : 'City is requried',
            state: (value) => value.length > 3 ? null : 'Satte is requried',
            country: (value) => value.length > 3 ? null : 'Country is requried',
        },
    });

    const preview = file?.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <div
                style={{ borderRadius: "100%", overflow: "clip", height: "130px", width: "130px" }}
            >
                <Image
                    key={index}
                    src={imageUrl}
                    imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
                />
            </div>
        );
    });


    return (
        <form onSubmit={form.onSubmit(async (values) => {
            try {
                if (!user) return
                setLoading(true)
                const url = await uploadAndGetURL(`${user.uid}/companydetails/company-logo.${values.companyLogo.type}}`, values.companyLogo)
                const companyData = {
                    ...values,
                    companyLogo: url
                }
                await setDoc(doc(db, "CompanyDetails", user.uid), companyData)
                dipatch(setCompanyDetails(companyData))
                setLoading(false)
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
        })}>
            <div className='min-h-screen grid md:grid-cols-2'>
                <div
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <div className='p-5 md:w-3/4 md:m-auto'>
                    <div className=''>
                        <Title order={2} align='center'>Company Details</Title>
                    </div>
                    <div className='my-5'>
                        {preview ? (
                            <div className='flex justify-center'>
                                {preview}
                                <ActionIcon
                                    variant='outline'
                                    onClick={() => setFile(null)}
                                >
                                    <IconX color='#D2042D' />
                                </ActionIcon>
                            </div>
                        ) : (
                            <div className='flex justify-center'>
                                <Dropzone
                                    accept={IMAGE_MIME_TYPE}
                                    multiple={false}
                                    onDrop={(files) => { setFile(files); form.setFieldValue("companyLogo", files[0]) }}
                                    style={{ borderRadius: "100%", overflow: "clip", height: "130px", width: "130px" }}
                                    className='flex justify-center items-center'
                                    {...form.getInputProps('companyLogo')}
                                >
                                    <div className='space-y-3 text-gray-400'>
                                        <div className='flex justify-center'>
                                            <IconUpload />
                                        </div>
                                        <div>
                                            <Text size="xs" align='center'>Drop File Here</Text>
                                            <Text size="xs" align='center'>Browse Files</Text>
                                        </div>
                                    </div>
                                </Dropzone>
                            </div>
                        )}
                    </div>
                    <TextInput
                        className='my-2'
                        label="Company Name"
                        name="Company Name"
                        placeholder='Name'
                        {...form.getInputProps("name")}
                    />
                    <TextInput
                        className='my-2'
                        label="Phone"
                        name="phone"
                        placeholder='Phone'
                        {...form.getInputProps("phone")}
                    />
                    <TextInput
                        className='my-2'
                        label="Email"
                        name="email"
                        placeholder='Email'
                        {...form.getInputProps("email")}
                    />
                    <TextInput
                        className='my-2'
                        label="Address"
                        name="address"
                        placeholder='Address'
                        {...form.getInputProps("address")}
                    />
                    <TextInput
                        className='my-2'
                        label="City"
                        name="city"
                        placeholder='City'
                        {...form.getInputProps("city")}
                    />
                    <TextInput
                        className='my-2'
                        label="State"
                        name="state"
                        placeholder='State'
                        {...form.getInputProps("state")}
                    />
                    <TextInput
                        className='my-2'
                        label="Country"
                        name="country"
                        placeholder='Country'
                        {...form.getInputProps("country")}
                    />
                    <div className='space-y-5 grid my-5'>
                        <Button type='submit' loading={loading}>Confirm</Button>
                        <Button variant='subtle' color='red' onClick={async () => {
                            try {
                                await signOut(auth)
                            } catch (error) {
                                showNotification({
                                    id: `reg-err-${Math.random()}`,
                                    autoClose: 5000,
                                    title: 'Error!',
                                    message: "Error logging out account try again",
                                    color: 'red',
                                    icon: <IconX />,
                                    loading: false,
                                });
                            }
                        }}>Logout</Button>
                    </div>
                </div>
            </div>
        </form>
    );
};