import React, { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from "react-pdf";
import { PDFWorker } from 'pdfjs-dist';

export const PDFviewer = ({ pdfUrl }: { pdfUrl: string }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const worker = new PDFWorker();
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    // useEffect(() => {
    //     pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/$%7Bpdfjs.version%7D/pdf.worker.js%60;%7D"
    // }, [])


    return (
        <div>
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                options={{ worker }}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
            <img src={pdfUrl} alt="PDF" />
        </div>
    )
}
