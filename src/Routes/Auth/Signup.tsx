import React, { useState } from 'react'
import image from '../../assets/page1.png'
import { Divider, Title, TextInput, PasswordInput, Button, Text } from '@mantine/core'
import { useNavigate } from "react-router-dom"
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications';
import { IconX } from "@tabler/icons-react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from '../../firebaseConfig'
import { GoogleButton } from './GoogleIcon'

export const Signup = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => {
                const regex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\|,.<>/?])(?=.*[0-9])\S{6,}$/;
                return regex.test(value) ? null : 'Password must contain 6 characters with at least 1 number and 1 special character';
            }
        },
    });

    return (
        <form onSubmit={form.onSubmit(async (values) => {
            try {
                setLoading(true)
                await createUserWithEmailAndPassword(auth, values.email, values.password);
                setLoading(false)
            } catch (error: any) {
                if (error.code === "auth/email-already-in-use") {
                    showNotification({
                        id: `reg-err-${Math.random()}`,
                        autoClose: 5000,
                        title: 'Error!',
                        message: "Account already exists, try to login",
                        color: 'red',
                        icon: <IconX />,
                        loading: false,
                    });
                    return
                }

                showNotification({
                    id: `reg-err-${Math.random()}`,
                    autoClose: 5000,
                    title: 'Error!',
                    message: "Error creating account try again",
                    color: 'red',
                    icon: <IconX />,
                    loading: false,
                });
            } finally {
                setLoading(false)
            }
        })}>
            <div className='min-h-screen grid  md:grid-cols-2'>
                <div
                    className='h-full'
                    style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                ></div>
                <div className='p-5 md:w-3/4 md:m-auto space-y-5'>
                    <Title align='center' pb={30}>
                        Create Your Account
                    </Title>
                    <div
                        className='space-y-3'
                    >
                        <TextInput
                            placeholder='Example.email@gmail.com'
                            label='Email'
                            variant='unstyled'
                            classNames={{
                                root: "border-solid border-b-[1px] border-black",
                                input: "px-3"
                            }}
                            {...form.getInputProps("email")}
                        />
                        <PasswordInput
                            placeholder="Enter at least 6+ characters"
                            label="Password"
                            variant='unstyled'
                            classNames={{
                                root: "border-solid border-b-[1px] border-black",
                            }}
                            {...form.getInputProps("password")}

                        />
                        <Button fullWidth type='submit' loading={loading}>
                            Sign Up
                        </Button>
                    </div>
                    <Divider label='Or' labelPosition="center" />
                    <div className='text-center'>
                        <GoogleButton>Continue with Google</GoogleButton>
                    </div>
                    <div className='flex gap-2 text-xs select-none justify-center'>
                        <Text>Alreadly have an account?</Text>
                        <Text
                            color='blue'
                            className='cursor-pointer hover:scale-105 duration-100 ease-linear'
                            onClick={() => navigate('/signin')}
                        >Log In</Text>
                    </div>
                </div>
            </div>
        </form>
    )
}
