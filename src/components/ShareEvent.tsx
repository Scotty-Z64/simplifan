import { useState } from 'react';
import { usePlans } from '@/context/PlansContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Wallet,
  ExternalLink,
  Download
} from 'lucide-react';

interface Props {
  planId: string;
}

export function ShareEvent({ planId: _planId }: Props) {
  const { currentPlan, calculateTotal, calculateContributions } = usePlans();
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!currentPlan) return null;

  const totalBudget = calculateTotal(currentPlan);
  const totalContributed = calculateContributions(currentPlan);
  const attendingGuests = currentPlan.guests.filter(g => g.status === 'attending').length;
  const totalPeople = currentPlan.guests.reduce((sum, g) => sum + 1 + g.plusOnes + g.children, 0);

  const eventTypeLabels: Record<string, string> = {
    wedding: 'Wedding',
    funeral: 'Funeral',
    umemulo: 'uMemulo',
    umgidi: 'uMgidi',
  };

  // Generate shareable text
  const generateShareText = () => {
    const lines = [
      `*${currentPlan.name || eventTypeLabels[currentPlan.eventType]}*`,
      '',
      `*Event Type:* ${eventTypeLabels[currentPlan.eventType]}`,
    ];

    if (currentPlan.eventDate) {
      lines.push(`*Date:* ${new Date(currentPlan.eventDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
    }
    
    if (currentPlan.eventTime) {
      lines.push(`*Time:* ${currentPlan.eventTime}`);
    }

    if (currentPlan.preciseLocation?.fullAddress) {
      lines.push(`*Location:* ${currentPlan.preciseLocation.venueName || ''}`);
      lines.push(`${currentPlan.preciseLocation.fullAddress}`);
    } else if (currentPlan.location) {
      lines.push(`*Location:* ${currentPlan.location}`);
    }

    if (currentPlan.numberOfGuests) {
      lines.push(`*Expected Guests:* ${currentPlan.numberOfGuests}`);
    }

    lines.push('');
    lines.push(`*Budget:* R ${totalBudget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`);
    
    if (totalContributed > 0) {
      lines.push(`*Contributions:* R ${totalContributed.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`);
    }

    if (currentPlan.guests.length > 0) {
      lines.push('');
      lines.push(`*Guests:* ${attendingGuests} attending / ${currentPlan.guests.length} invited`);
    }

    if (currentPlan.preciseLocation?.additionalDetails) {
      lines.push('');
      lines.push(`*Directions:* ${currentPlan.preciseLocation.additionalDetails}`);
    }

    lines.push('');
    lines.push('_Planned with SimpliPlan_');

    return lines.join('\n');
  };

  const shareText = generateShareText();
  const encodedText = encodeURIComponent(shareText);

  // Share via WhatsApp
  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  // Share via Email
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${currentPlan.name || eventTypeLabels[currentPlan.eventType]} - Event Details`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Generate Google Maps link
  const getMapsLink = () => {
    if (currentPlan.preciseLocation?.fullAddress) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentPlan.preciseLocation.fullAddress)}`;
    } else if (currentPlan.location) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentPlan.location)}`;
    }
    return null;
    };

  // Export as text file
  const exportAsText = () => {
    const blob = new Blob([shareText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlan.name || 'event'}-details.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const mapsLink = getMapsLink();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white">
          <Share2 className="w-4 h-4 mr-2" />
          Share Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-teal-500" />
            Share Event Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Event Summary Preview */}
          <div className="p-4 bg-gray-800/30 rounded-lg space-y-2">
            <h4 className="font-semibold text-white text-lg">
              {currentPlan.name || eventTypeLabels[currentPlan.eventType]}
            </h4>
            
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4 text-teal-500" />
                {currentPlan.eventDate 
                  ? new Date(currentPlan.eventDate).toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  : 'Date not set'}
              </div>
              
              {currentPlan.eventTime && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-teal-500" />
                  {currentPlan.eventTime}
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-teal-500" />
                {currentPlan.preciseLocation?.venueName || currentPlan.location || 'Location not set'}
              </div>
              
              {currentPlan.preciseLocation?.fullAddress && (
                <p className="text-xs text-gray-500 ml-6">{currentPlan.preciseLocation.fullAddress}</p>
              )}
              
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4 text-teal-500" />
                {totalPeople > 0 ? `${totalPeople} people` : `${currentPlan.numberOfGuests || 0} expected guests`}
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <Wallet className="w-4 h-4 text-teal-500" />
                Budget: R {totalBudget.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Google Maps Link */}
            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 mt-2"
              >
                <ExternalLink className="w-3 h-3" />
                View on Google Maps
              </a>
            )}
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <button
              onClick={shareViaWhatsApp}
              className="flex items-center justify-center gap-2 p-3 bg-emerald-500/100 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">WhatsApp</span>
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">Email</span>
            </button>

            {/* Copy Text */}
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {/* Download */}
            <button
              onClick={exportAsText}
              className="flex items-center justify-center gap-2 p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>

          {/* Preview of share text */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Preview:</p>
            <div className="p-3 bg-gray-100 rounded-lg max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap">{shareText}</pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
