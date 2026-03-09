import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SubscriptionSuccess = () => (
  <Layout showFooter>
    <SEO title="Subscription Confirmed — MᴀᴘMᴇ.Lɪᴠᴇ" description="Your Pro subscription is now active." noindex />
    <main className="container mx-auto px-4 py-24 max-w-lg text-center">
      <Card className="shadow-lg">
        <CardContent className="pt-10 pb-10 space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">You're on Pro! 🎉</h1>
          <p className="text-muted-foreground">
            Your subscription is now active. Enjoy unlimited trackers, geofence alerts, API access, and more.
          </p>
          <Button asChild size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  </Layout>
);

export default SubscriptionSuccess;
