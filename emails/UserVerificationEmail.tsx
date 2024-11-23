import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  userFirstname: string;
  confirmationLink: string;
}

export const UserVerificationEmail = ({
  userFirstname,
  confirmationLink,
}: EmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body style={main}>
        <Container className="mx-auto pt-[20px] pb-[48px]">
          <Img
            src={`https://wbmerch.store/logo.png`}
            width="100"
            height="50"
            alt="wbmerch logo"
            className="mx-auto"
          />
          <Text className="text-base leading-[26px]">Hi {userFirstname},</Text>
          <Text className="text-base leading-[26px]">
            Welcome to WB Merch, where style meets quality. We’re thrilled to
            have you join our community of fashion-forward individuals.
          </Text>
          <Text className="text-base leading-[26px]">
            Verify your email to unlock a seamless shopping experience and
            exclusive perks.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-[#121212] rounded-[3px] text-white text-base decoration-0 text-center block p-3"
              href={confirmationLink}
            >
              Verify email
            </Button>
          </Section>
          <Text className="text-base leading-[26px]">
            Thank you for choosing WB Merch. Let’s make your wardrobe
            extraordinary!
          </Text>
          <Text className="text-base leading-[26px]">
            Best,
            <br />
            The WB Merch Team
          </Text>
          <Hr style={hr} />
          <Text className="text-[#8898aa] text-xs">
            470 Noor Ave STE B #1148, South San Francisco, CA 94080
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default UserVerificationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
