/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Hr, Img } from 'npm:@react-email/components@0.0.22';
import { LOGO_URL, SITE_NAME, main, container, logoSection, logoImg, logoText, h1, text, hr, footer, linkStyle } from './styles.ts';

interface ReauthenticationEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  token: string;
}

const codeStyle = { backgroundColor: 'hsl(210, 30%, 94%)', borderRadius: '8px', color: 'hsl(222, 47%, 11%)', display: 'inline-block', fontSize: '32px', fontWeight: '700', letterSpacing: '6px', padding: '16px 32px', textAlign: 'center' as const };

export default function ReauthenticationEmail({ siteName, siteUrl, recipient, token }: ReauthenticationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img src={LOGO_URL} alt={SITE_NAME} style={logoImg} />
            <Text style={logoText}>{SITE_NAME}</Text>
          </Section>
          <Text style={h1}>Verification code</Text>
          <Text style={text}>Enter this code to verify your identity:</Text>
          <Section style={{ textAlign: 'center' as const, margin: '32px 0' }}>
            <Text style={codeStyle}>{token}</Text>
          </Section>
          <Text style={text}>This code expires in 10 minutes. If you didn't request this, please secure your account.</Text>
          <Hr style={hr} />
          <Text style={footer}>© {siteName} · <a href={siteUrl} style={linkStyle}>{siteUrl}</a></Text>
        </Container>
      </Body>
    </Html>
  );
}
