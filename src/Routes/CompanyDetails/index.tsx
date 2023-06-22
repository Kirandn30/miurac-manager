import React from "react"
import image from "../../assets/page2.png"
import { CompanyDetailsForm } from './CompanyDetailsForm';

export default function CompanayForm() {

    return (
        <div className='min-h-screen grid md:grid-cols-2'>
            <div
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            <CompanyDetailsForm />
        </div>
    );
};