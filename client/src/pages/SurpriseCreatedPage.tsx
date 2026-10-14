import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Copy,
  Check,
  Share2,
  ExternalLink,
  Sparkles,
  Download,
  MessageCircle,
  Send,
  Gift,
  Heart,
  Eye,
} from 'lucide-react';
import { triggerFullCelebration } from '../components/ConfettiEffect';

export const SurpriseCreatedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [copied, setCopied] = useState(false);
  const [answersCopied, setAnswersCopied] = useState(false);

  // Full recipient share URL
  const shareUrl = `${window.location.origin}/birthday/${id}`;

  // Private answers URL
  const answersUrl = token
    ? `${window.location.origin}/answers/${id}?token=${encodeURIComponent(token)}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    triggerFullCelebration();
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyAnswersLink = () => {
    if (!answersUrl) return;
    navigator.clipboard.writeText(answersUrl);
    setAnswersCopied(true);
    setTimeout(() => setAnswersCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'A Magical Birthday Surprise For You! 🎂',
          text: 'Someone has created a special birthday surprise for you. Open to unwrap the magic!',
          url: shareUrl,
        });
      } catch (err) {
        // Cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById('birthday-qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 300, 300);
        ctx.drawImage(img, 20, 20, 260, 260);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `Birthday-Bliss-QR-${id}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🎂 I made a special birthday surprise for you! Open it here: ${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent('🎂 Open your magical birthday surprise!')}`;

  return (
    <div className="min-h-screen bg-[#0b0813] text-slate-100 selection:bg-rose-500 selection:text-white py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl glass-panel p-6 sm:p-10 rounded-3xl border border-white/15 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-gradient-to-b from-rose-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 p-0.5 shadow-xl shadow-rose-500/30 mx-auto mb-6">
          <div className="w-full h-full bg-[#130b22] rounded-[22px] flex items-center justify-center text-3xl">
            🎉
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Surprise Successfully Created!</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white mb-2">
          Your Magical Link Is Ready
        </h1>

        <p className="text-slate-300 text-xs sm:text-sm mb-8 leading-relaxed max-w-md mx-auto">
          Share this unique link with the recipient. When they open it and blow out the candles, "En Nenjorathil" will play, and they will experience your personalized wish!
        </p>

        {/* Public Shareable Link Box */}
        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-2 mb-6 text-left">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent text-xs sm:text-sm text-slate-200 focus:outline-none w-full truncate font-mono select-all"
          />

          <button
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              copied
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-md'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={handleNativeShare}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-2 transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Share via Device</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center gap-2 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/40 border border-sky-500/30 text-xs font-semibold text-sky-300 flex items-center gap-2 transition-all"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>Telegram</span>
          </a>
        </div>

        {/* QR Code Section */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <div className="p-3 bg-white rounded-2xl shadow-lg">
            <QRCodeSVG
              id="birthday-qr-code"
              value={shareUrl}
              size={120}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="text-left flex flex-col items-center sm:items-start">
            <h4 className="text-sm font-bold text-white mb-1">Print or Send QR Code</h4>
            <p className="text-xs text-slate-400 mb-3 max-w-[200px]">
              Print this onto a greeting card or gift tag so they can scan it with their phone camera!
            </p>
            <button
              onClick={handleDownloadQr}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-amber-300 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR Image</span>
            </button>
          </div>
        </div>

        {/* Private Answers Section for Creator */}
        {answersUrl && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 to-purple-950/40 border border-rose-500/30 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Private To You: Recipient's Answers</span>
              </span>
              <span className="text-[10px] text-amber-300 font-medium">Confidential</span>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              When the recipient answers your "Let's Talk About Us ❤️" questions, their responses will appear on your private dashboard. Keep this link bookmarked!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Link
                to={`/answers/${id}?token=${encodeURIComponent(token)}`}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/30 hover:bg-rose-500/40 border border-rose-400/40 text-xs font-bold text-rose-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Responses Dashboard</span>
              </Link>

              <button
                onClick={handleCopyAnswersLink}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 flex items-center justify-center gap-1 transition-all"
              >
                {answersCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{answersCopied ? 'Link Copied!' : 'Copy Dashboard Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* View Experience Now CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/birthday/${id}`}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 hover:scale-105 transition-all shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            <span>Open Experience Now</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-3.5 rounded-full text-xs text-slate-400 hover:text-white transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
