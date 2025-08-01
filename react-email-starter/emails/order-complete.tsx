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

interface VercelOrderCompleteProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const VercelOrderComplete = ({
  username,
  userImage,
  invitedByUsername,
  invitedByEmail,
  teamName,
  teamImage,
  inviteLink,
  inviteFromIp,
  inviteFromLocation,
}: VercelOrderCompleteProps) => {
  const previewText = `Join ${invitedByUsername} on Vercel`;

  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-gray-100 p-6">
          <Container className="bg-white p-6 rounded-lg shadow-md mx-auto">
            {/* Logo */}
            <Img
              src={`${baseUrl}/static/sham_logo2.png`}
              alt="Shamrock"
              className="w-24 h-auto mx-auto"
            />

            {/* Title Heading */}
            <Heading as="h1" className="text-2xl font-bold text-center text-gray-800 mb-6">
              Order Complete
            </Heading>

            {/* Greeting Paragraphs */}
            <Text className="text-gray-700 mb-4">Hello John Doe,</Text>
            <Text className="text-gray-700 mb-6">
              Your order is Complete. We hope you enjoy them and we hope to see you back at the Shamrock!
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
                  <tr>
                    <td
                      className="border-b border-gray-100 px-3 py-2"
                      data-label="Item"
                    >
                      Sample Product 1
                    </td>
                    <td
                      className="border-b border-gray-100 px-3 py-2 text-center"
                      data-label="Qty"
                    >
                      1
                    </td>
                    <td
                      className="border-b border-gray-100 px-3 py-2 text-right"
                      data-label="Price"
                    >
                      $29.99
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="border-b border-gray-100 px-3 py-2"
                      data-label="Item"
                    >
                      Baked Polvoron - 225g
                    </td>
                    <td
                      className="border-b border-gray-100 px-3 py-2 text-center"
                      data-label="Qty"
                    >
                      2
                    </td>
                    <td
                      className="border-b border-gray-100 px-3 py-2 text-right"
                      data-label="Price"
                    >
                      $30.00
                    </td>
                  </tr>
                </tbody>
              </table>

              <Text className="text-gray-800 text-right font-bold mb-6">Total: $59.99</Text>

            </Section>

            {/* Store Information */}
            <Text className="text-gray-900 font-bold mb-2">Store Information:</Text>
            <Text className="text-gray-700">Store Name: Example Store</Text>
            <Text className="text-gray-700">Address: 123 Main Street, City, State ZIP</Text>
            <Text className="text-gray-700 mb-6">Contact: (123) 456-7890</Text>

            {/* Customer Information */}
            <Text className="text-gray-900 font-bold mb-2">Customer Information:</Text>
            <Text className="text-gray-700">Name: John Doe</Text>
            <Text className="text-gray-700">Email: john.doe@example.com</Text>
            <Text className="text-gray-700 mb-6">Phone: (987) 654-3210</Text>

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

VercelOrderComplete.PreviewProps = {
  username: 'alanturing',
  userImage: `${baseUrl}/static/sham_logo2.png`,
  invitedByUsername: 'Alan',
  invitedByEmail: 'alan.turing@example.com',
  teamName: 'Enigma',
  teamImage: `${baseUrl}/static/vercel-team.png`,
  inviteLink: 'https://vercel.com/teams/invite/foo',
  inviteFromIp: '204.13.186.218',
  inviteFromLocation: 'São Paulo, Brazil',
} as VercelOrderCompleteProps;

export default VercelOrderComplete;
