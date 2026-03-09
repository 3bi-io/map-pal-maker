import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SubscriptionCancel = () => (
  <Layout showFooter>
    <SEO title="Checkout Cancelled — MᴀᴘMᴇ.Lɪᴠᴇ" description="Your checkout was cancelled." noindex />
    <main className="container mx-auto px-4 py-24 max-w-lg text-center">
      <Card className="shadow-lg">
        <CardContent className="pt-10 pb-10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Checkout Cancelled</h1>
          <p className="text-muted-foreground">
            No worries — you weren't charged. You can upgrade anytime.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link to="/pricing">View Plans</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  </Layout>
);

export default SubscriptionCancel;
