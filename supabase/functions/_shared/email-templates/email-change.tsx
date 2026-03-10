/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Button, Hr, Img } from 'npm:@react-email/components@0.0.22';
import { LOGO_URL, SITE_NAME, main, container, logoSection, logoImg, logoText, h1, text, button, hr, footer, ctaSection, linkStyle } from './styles.ts';

interface EmailChangeProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
  newEmail?: string;
}

export default function EmailChangeEmail({ siteName, siteUrl, recipient, confirmationUrl, newEmail }: EmailChangeProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} style={logoImg} />
            <Text style={logoText}>{SITE_NAME}</Text>
          </Section>
          <Text style={h1}>Confirm email change</Text>
          <Text style={text}>
            We received a request to change your email address{newEmail ? ` to ${newEmail}` : ''}. Click below to confirm this change.
          </Text>
          <Section style={ctaSection}>
            <Button style={button} href={confirmationUrl}>Confirm Email Change</Button>
          </Section>
          <Text style={text}>If you didn't request this change, please secure your account immediately.</Text>
          <Hr style={hr} />
          <Text style={footer}>© {siteName} · <a href={siteUrl} style={linkStyle}>{siteUrl}</a></Text>
        </Container>
      </Body>
    </Html>
  );
}
