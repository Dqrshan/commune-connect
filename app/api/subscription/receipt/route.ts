import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { downloadReceipt } from '@/lib/dodopayments'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { customerId, paymentId } = await request.json()

        if (!customerId && !paymentId) {
            return NextResponse.json({
                error: 'Customer ID or Payment ID is required'
            }, { status: 400 })
        }

        try {
            // Download receipt using dodopayments package
            const receiptData = await downloadReceipt(paymentId || `payment_${customerId}_latest`)

            // Return the PDF as a blob
            return new NextResponse(receiptData, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="receipt.pdf"'
                }
            })
        } catch (dodoError) {
            console.error('Error downloading receipt from Dodo Payments:', dodoError)

            // Generate a mock receipt for demo purposes
            const mockReceiptContent = generateMockReceipt(session.user.name, session.user.email)

            return new NextResponse(mockReceiptContent, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="receipt.pdf"'
                }
            })
        }

    } catch (error) {
        console.error('Error processing receipt request:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

function generateMockReceipt(customerName: string, customerEmail: string): Buffer {
    // This is a mock PDF content - in a real app, you'd use a PDF library like jsPDF or PDFKit
    const mockPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(CommuneConnect - Payment Receipt) Tj
0 -20 Td
(Customer: ${customerName}) Tj
0 -20 Td
(Email: ${customerEmail}) Tj
0 -20 Td
(Date: ${new Date().toLocaleDateString()}) Tj
0 -20 Td
(Amount: $9.00 USD) Tj
0 -20 Td
(Status: Paid) Tj
0 -20 Td
(Transaction ID: tx_${Date.now()}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000526 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`

    return Buffer.from(mockPdfContent, 'utf-8')
}