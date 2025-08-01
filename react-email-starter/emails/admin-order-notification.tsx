import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
    Hr,
} from '@react-email/components';

export interface AdminOrderNotificationProps {
    siteName: string;
    logoUrl: string;
    orderNumber: string;
    orderStatus: string;
    orderStatusColor?: string;
    orderDate: string;
    adminOrderUrl: string;
    items: Array<{
        id: string;
        name: string;
        quantity: number;
        lineTotal: string;
    }>;
    subtotal: string;
    shippingTotal: string;
    taxTotal: string;
    total: string;
    paymentMethod: string;
    paymentStatus: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    billingAddress: string;
    shippingAddress: string;
    storeName: string;
    storeAddress: string;
    storeContact: string;
    facebookUrl?: string;
    instagramUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
    : '';

export const AdminOrderNotification = ({
    siteName,
    logoUrl,
    orderNumber,
    orderStatus,
    orderStatusColor = '#2c3e50',
    orderDate,
    adminOrderUrl,
    items,
    subtotal,
    shippingTotal,
    taxTotal,
    total,
    paymentMethod,
    paymentStatus,
    customerName,
    customerEmail,
    customerPhone = '',
    billingAddress,
    shippingAddress,
    storeName,
    storeAddress,
    storeContact,
    facebookUrl = 'https://facebook.com/yourpage',
    instagramUrl = 'https://instagram.com/yourpage',
}: AdminOrderNotificationProps) => {
    const previewText = `New order #${orderNumber} on ${siteName}`;

    return (
        <Html lang="en">
            <Head />
            <Preview>{previewText}</Preview>
            <Tailwind>
                <Body className="bg-gray-100 p-6">
                    <Container className="bg-white p-6 rounded-lg shadow-md mx-auto">

                        {/* Logo */}
                        <Img
                            src={logoUrl}
                            alt={siteName}
                            className="w-24 h-auto mx-auto mb-4"
                        />

                        {/* Header */}
                        <Heading
                            as="h1"
                            className="text-2xl font-bold text-center text-gray-800 mb-6"
                        >
                            🛒 New Order #{orderNumber}
                        </Heading>
                        <Text className="text-center text-gray-700 mb-4">
                            Status:{' '}
                            <span style={{ color: orderStatusColor, fontWeight: 600 }}>
                                {orderStatus}
                            </span>{' '}
                            · Placed on {orderDate}
                        </Text>

                        {/* Order Items */}
                        <Section className="mb-6">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b border-gray-200 px-3 py-2 text-left">
                                            Item
                                        </th>
                                        <th className="border-b border-gray-200 px-3 py-2 text-center">
                                            Qty
                                        </th>
                                        <th className="border-b border-gray-200 px-3 py-2 text-right">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="border-b border-gray-100 px-3 py-2">
                                                {item.name}
                                            </td>
                                            <td className="border-b border-gray-100 px-3 py-2 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="border-b border-gray-100 px-3 py-2 text-right">
                                                {item.lineTotal}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} className="px-3 py-2 text-right font-medium">
                                            Subtotal:
                                        </td>
                                        <td className="px-3 py-2 text-right">{subtotal}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="px-3 py-2 text-right font-bold">
                                            Total:
                                        </td>
                                        <td className="px-3 py-2 text-right font-bold">{total}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </Section>

                        {/* Payment & Customer */}
                        <Row className="mb-6">
                            <Column>
                                <Text className="text-gray-900 font-bold mb-1">Payment</Text>
                                <Text className="text-gray-700">
                                    Method: {paymentMethod}
                                </Text>
                                <Text className="text-gray-700">
                                    Status: {paymentStatus}
                                </Text>
                            </Column>
                            <Column>
                                <Text className="text-gray-900 font-bold mb-1">Customer</Text>
                                <Text className="text-gray-700">
                                    {customerName} ({customerEmail})
                                </Text>
                                {customerPhone && (
                                    <Text className="text-gray-700">Phone: {customerPhone}</Text>
                                )}
                            </Column>
                        </Row>



                        {/* CTA */}
                        <Section className="text-center mb-6">
                            <Button
                                href={adminOrderUrl}
                                className="bg-[#67a626] text-white px-5 py-2 rounded"
                            >
                                View in Admin Panel
                            </Button>
                        </Section>


                        <Text className="text-gray-600 mb-2">
                            This is a system generated email. Please do not reply to this email. Have you any questions regarding your order? Contact us at order@shamrockotap.com
                        </Text>
                        <Text className="flex flex-row justify-start space-x-4">
                            <Link href="https://www.facebook.com/shamrockotap/" className="mx-1">
                                <Img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_(square).png/240px-Facebook_logo_(square).png"
                                    alt="Facebook"
                                    width="24"
                                    height="24"
                                />
                            </Link>
                            <Link href="https://www.instagram.com/shamrockotap/" className="mx-1">
                                <Img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/240px-Instagram_icon.png"
                                    alt="Instagram"
                                    width="24"
                                    height="24"
                                />
                            </Link>

                        </Text>
                        <Img
                            src={`${baseUrl}/static/sham_logo2.png`}
                            alt="Shamrock"
                            className="w-24 h-auto flex justify-start"
                        />
                        <Text className="text-gray-600 mb-2">
                            ©1945–{new Date().getFullYear()} Shamrock. All Rights Reserved.
                        </Text>
                        {/* Footer with support contact and social icons */}
                        <Section className="bg-gray-50 p-4 text-left">

                            <Text className="text-gray-600 mb-2 mt-6">
                                This e-mail message is intended for the use of the individual or the entity to whom it is addressed and may contain information that is privileged, proprietary, confidential and exempt from disclosure. If you are not the intended recipient, you are notified that any dissemination, distribution or copying of this communication is strictly prohibited. Please notify the above address and delete the original message immediately. Thank you.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

AdminOrderNotification.PreviewProps = {
    siteName: 'Shamrock Express',
    logoUrl: `${baseUrl}/static/sham_logo2.png`,
    orderNumber: '12345',
    orderStatus: 'Pending',
    orderDate: 'June 26, 2025',
    adminOrderUrl: `${baseUrl}/admin/orders/12345`,
    items: [
        { id: '1', name: 'Sample Product 1', quantity: 1, lineTotal: '$29.99' },
        { id: '2', name: 'Baked Polvoron - 225g', quantity: 2, lineTotal: '$30.00' },
    ],
    subtotal: '$59.99',
    shippingTotal: '$0.00',
    taxTotal: '$0.00',
    total: '$59.99',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '(987) 654-3210',
    billingAddress: '123 Main St\nCity, State ZIP\nCountry',
    shippingAddress: '123 Main St\nCity, State ZIP\nCountry',
    storeName: 'Shamrock Express',
    storeAddress: '123 Main Street, City, State ZIP',
    storeContact: '(123) 456-7890',
    facebookUrl: 'https://www.facebook.com/shamrockotap/',
    instagramUrl: 'https://www.instagram.com/shamrockotap/',
} as AdminOrderNotificationProps;

export default AdminOrderNotification;
