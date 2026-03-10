/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Hr } from 'npm:@react-email/components@0.0.22';

interface ReauthenticationEmailProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  token: string;
}

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' };
const logoSection = { textAlign: 'center' as const, marginBottom: '32px' };
const h1 = { color: 'hsl(222, 47%, 11%)', fontSize: '24px', fontWeight: '700', lineHeight: '1.3', margin: '0 0 16px' };
const text = { color: 'hsl(215, 16%, 47%)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' };
const codeStyle = { backgroundColor: 'hsl(210, 30%, 94%)', borderRadius: '8px', color: 'hsl(222, 47%, 11%)', display: 'inline-block', fontSize: '32px', fontWeight: '700', letterSpacing: '6px', padding: '16px 32px', textAlign: 'center' as const };
const hr = { borderColor: 'hsl(214, 32%, 91%)', margin: '32px 0' };
const footer = { color: 'hsl(215, 16%, 47%)', fontSize: '12px', lineHeight: '1.5' };

export default function ReauthenticationEmail({ siteName, siteUrl, recipient, token }: ReauthenticationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={{ ...h1, fontSize: '20px', letterSpacing: '1px' }}>MᴀᴘMᴇ.Lɪᴠᴇ</Text>
          </Section>
          <Text style={h1}>Verification code</Text>
          <Text style={text}>
            Enter this code to verify your identity:
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Text style={codeStyle}>{token}</Text>
          </Section>
          <Text style={text}>
            This code expires in 10 minutes. If you didn't request this, please secure your account.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            © {siteName} · <a href={siteUrl} style={{ color: 'hsl(205, 95%, 52%)', textDecoration: 'none' }}>{siteUrl}</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
