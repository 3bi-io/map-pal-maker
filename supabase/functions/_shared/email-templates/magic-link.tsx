/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Button, Hr, Img } from 'npm:@react-email/components@0.0.22';
import { LOGO_URL, SITE_NAME, main, container, logoSection, logoImg, logoText, h1, text, button, hr, footer, ctaSection, linkStyle } from './styles.ts';

interface MagicLinkEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
}

export default function MagicLinkEmail({ siteName, siteUrl, recipient, confirmationUrl }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} style={logoImg} />
            <Text style={logoText}>{SITE_NAME}</Text>
          </Section>
          <Text style={h1}>Sign in to {siteName}</Text>
          <Text style={text}>Click the button below to sign in to your account. This link expires in 10 minutes.</Text>
          <Section style={ctaSection}>
            <Button style={button} href={confirmationUrl}>Sign In</Button>
          </Section>
          <Text style={text}>If you didn't request this link, you can safely ignore this email.</Text>
          <Hr style={hr} />
          <Text style={footer}>© {siteName} · <a href={siteUrl} style={linkStyle}>{siteUrl}</a></Text>
        </Container>
      </Body>
    </Html>
  );
}
