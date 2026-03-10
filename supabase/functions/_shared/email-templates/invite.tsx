/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Button, Hr, Img } from 'npm:@react-email/components@0.0.22';
import { LOGO_URL, SITE_NAME, main, container, logoSection, logoImg, logoText, h1, text, button, hr, footer, ctaSection, linkStyle } from './styles.ts';

interface InviteEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

export default function InviteEmail({ siteName, siteUrl, recipient, confirmationUrl }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} style={logoImg} />
            <Text style={logoText}>{SITE_NAME}</Text>
          </Section>
          <Text style={h1}>You've been invited! 🗺️</Text>
          <Text style={text}>You've been invited to join {siteName}. Click below to accept the invitation and set up your account.</Text>
          <Section style={ctaSection}>
            <Button style={button} href={confirmationUrl}>Accept Invitation</Button>
          </Section>
          <Text style={text}>If you weren't expecting this invitation, you can safely ignore this email.</Text>
          <Hr style={hr} />
          <Text style={footer}>© {siteName} · <a href={siteUrl} style={linkStyle}>{siteUrl}</a></Text>
        </Container>
      </Body>
    </Html>
  );
}
