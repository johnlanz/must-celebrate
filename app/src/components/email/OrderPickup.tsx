import { formatDate } from '@/utils/formatDate';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderEmailProps {
  orderNumber: string;
  buyer: { firstName: string; lastName: string, email: string };
  items: OrderItem[];
  total: number;
  store: any;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const OrderPickup = ({ orderNumber, buyer, items, total, store }: OrderEmailProps) => {
    const nowStr = formatDate();

  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 p-6">
          <Container className="bg-white p-6 rounded-lg shadow-md mx-auto">
            {/* Logo */}
            <Img
              src={`${baseUrl}/images/sham_logo2.png`}
              alt="Shamrock"
              className="w-24 h-auto mx-auto"
            />

            {/* Title Heading */}
            <Heading as="h1" className="text-2xl font-bold text-center text-gray-800 mb-6">
              Order Ready for Pickup
            </Heading>

            {/* Greeting Paragraphs */}
            <Text className="text-gray-700 mb-4">Hello {buyer.firstName} {buyer.lastName},</Text>
            <Text className="text-gray-700 mb-6">
             We are pleased to let you know that your order is now ready for pickup. Please go to the counter to collect your order. Below you'll find a summary of your order and pickup details.
            </Text>

            {/* Order Summary Table */}
            <Section className="mb-6">
                <table className="responsive-table w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-200 px-3 py-2 text-left">
                      Item
                    </th>
                    <th className="border-b border-gray-200 px-3 py-2 text-center">
                      Qty
                    </th>
                    <th className="border-b border-gray-200 px-3 py-2 text-right">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={i}>
                            <td
                                className="border-b border-gray-100 px-3 py-2"
                                data-label="Item"
                            >
                                {item.name}
                            </td>
                            <td
                                className="border-b border-gray-100 px-3 py-2 text-center"
                                data-label="Qty"
                            >
                                {item.quantity}
                            </td>
                            <td
                                className="border-b border-gray-100 px-3 py-2 text-right"
                                data-label="Price"
                            >
                                ₱{item.price.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>

              <Text className="text-gray-800 text-right font-bold mt-4">
                Total: ₱{total.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}
              </Text>

            </Section>

            {/* Store Information */}
            <Text className="text-gray-900 font-bold mb-2">Store Information:</Text>
            <Text className="text-gray-700">Store Name: {store.name}</Text>
            <Text className="text-gray-700">Address: {`${store.address_line_1} ${store.address_line_2 || ''} ${store.city || ''}`}</Text>
            <Text className="text-gray-700 mb-6">Contact: {store.phone_number}</Text>

            {/* Customer Information */}
            <Text className="text-gray-900 font-bold mb-2">Customer Information:</Text>
            <Text className="text-gray-700">Name: {buyer.firstName} {buyer.lastName}</Text>
            <Text className="text-gray-700">Email: {buyer.email}</Text>
            
            <Text className="text-gray-900 font-bold mb-2">Additional Information:</Text>
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
              src={`${baseUrl}/images/sham_logo2.png`}
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

export default OrderPickup;