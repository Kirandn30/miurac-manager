import React, { useState } from 'react'
import image from '../../assets/page1.png'
import { Center, Title, TextInput, PasswordInput, Button, Text } from '@mantine/core'
import { useNavigate } from "react-router-dom"
import { useForm } from '@mantine/form'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react'

export const Signin = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => value.length >= 6 ? null : 'Password must contain 6 characters at least',
        },
    });

    return (
        <form onSubmit={form.onSubmit(async (values) => {
            try {
                setLoading(true)
                await signInWithEmailAndPassword(auth, values.email, values.password);
                setLoading(false)
            } catch (error) {
                showNotification({
                    id: `reg-err-${Math.random()}`,
                    autoClose: 5000,
                    title: 'Error!',
                    message: "Error logging into account try again",
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
                <div className='p-5 md:w-3/4 md:m-auto'>
                    <Title align='center' pb={40}>
                        Welcome
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
                        <div className='flex gap-2 text-xs select-none justify-end'>
                            <Text>Don't have an account?</Text>
                            <Text
                                color='blue'
                                className='cursor-pointer hover:scale-105 duration-100 ease-linear'
                                onClick={() => navigate('/')}
                            >Sign up</Text>
                        </div>
                        <Button fullWidth loading={loading} type='submit' >
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}