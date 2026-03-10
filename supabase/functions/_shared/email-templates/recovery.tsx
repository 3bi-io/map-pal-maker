/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Button, Hr, Img } from 'npm:@react-email/components@0.0.22';
import { LOGO_URL, SITE_NAME, main, container, logoSection, logoImg, logoText, h1, text, button, hr, footer, ctaSection, linkStyle } from './styles.ts';

interface RecoveryEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

export default function RecoveryEmail({ siteName, siteUrl, recipient, confirmationUrl }: RecoveryEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} style={logoImg} />
            <Text style={logoText}>{SITE_NAME}</Text>
          </Section>
          <Text style={h1}>Reset your password</Text>
          <Text style={text}>
            We received a request to reset the password for {recipient}. Click the button below to choose a new password.
          </Text>
          <Section style={ctaSection}>
            <Button style={button} href={confirmationUrl}>Reset Password</Button>
          </Section>
          <Text style={text}>If you didn't request this, you can safely ignore this email. Your password won't change.</Text>
          <Hr style={hr} />
          <Text style={footer}>© {siteName} · <a href={siteUrl} style={linkStyle}>{siteUrl}</a></Text>
        </Container>
      </Body>
    </Html>
  );
}
