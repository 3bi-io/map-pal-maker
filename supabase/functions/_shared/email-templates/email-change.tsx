/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22';

interface EmailChangeProps {
  siteName: string;
  siteUrl: string;
  recipient: string;
  confirmationUrl: string;
  newEmail?: string;
}

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' };
const logoSection = { textAlign: 'center' as const, marginBottom: '32px' };
const h1 = { color: 'hsl(222, 47%, 11%)', fontSize: '24px', fontWeight: '700', lineHeight: '1.3', margin: '0 0 16px' };
const text = { color: 'hsl(215, 16%, 47%)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' };
const button = { backgroundColor: 'hsl(205, 95%, 52%)', borderRadius: '12px', color: '#ffffff', display: 'inline-block', fontSize: '15px', fontWeight: '600', lineHeight: '1', padding: '14px 28px', textDecoration: 'none', textAlign: 'center' as const };
const hr = { borderColor: 'hsl(214, 32%, 91%)', margin: '32px 0' };
const footer = { color: 'hsl(215, 16%, 47%)', fontSize: '12px', lineHeight: '1.5' };

export default function EmailChangeEmail({ siteName, siteUrl, recipient, confirmationUrl, newEmail }: EmailChangeProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={{ ...h1, fontSize: '20px', letterSpacing: '1px' }}>MᴀᴘMᴇ.Lɪᴠᴇ</Text>
          </Section>
          <Text style={h1}>Confirm email change</Text>
          <Text style={text}>
            We received a request to change your email address{newEmail ? ` to ${newEmail}` : ''}. Click below to confirm this change.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button style={button} href={confirmationUrl}>
              Confirm Email Change
            </Button>
          </Section>
          <Text style={text}>
            If you didn't request this change, please secure your account immediately.
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
