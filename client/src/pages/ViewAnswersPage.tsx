import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowLeft, RefreshCw, Lock, MessageSquare } from 'lucide-react';
import { api, type GetAnswersResponse } from '../services/api';

export const ViewAnswersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GetAnswersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnswers = async () => {
    if (!id || !token) {
      setError('A private access token is required to view answers.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAnswers(id, token);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Unauthorized or unable to load answers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, [id, token]);

  return (
    <div className="min-h-screen bg-[#0b0813] text-slate-100 selection:bg-rose-500 selection:text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Birthday Bliss Home</span>
          </Link>

          <button
            onClick={fetchAnswers}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-rose-300 border border-rose-500/20 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Answers</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/25 text-rose-300 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Private Creator Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            Recipient's Responses & Love Notes
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            These answers are completely confidential between you and {data?.recipientName || 'the recipient'}.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="glass-panel p-10 rounded-3xl text-center">
            <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-300">Retrieving confidential answers...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 text-center">
            <Lock className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Access Restricted</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">{error}</p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full bg-rose-500 text-white text-xs font-bold"
            >
              Return Home
            </Link>
          </div>
        )}

        {/* Answers List */}
        {!loading && !error && data && (
          <div>
            {data.answers.length === 0 ? (
              <div className="glass-panel p-10 rounded-3xl text-center border border-white/10">
                <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">No Answers Submitted Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4 leading-relaxed">
                  {data.recipientName} has not reached the "Let's Talk About Us ❤️" section yet.
                  Once they blow out their candles and answer your questions, their responses will appear right here!
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-amber-300 text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Check back soon or refresh anytime!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs font-semibold text-rose-300 px-2 flex justify-between">
                  <span>{data.recipientName}'s Answers ({data.answers.length})</span>
                  <span>❤️ Sealed With Care</span>
                </div>

                {data.answers.map((ans, idx) => (
                  <motion.div
                    key={ans.questionId || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-950/40 via-[#160c2b] to-black/60 border border-rose-500/20 shadow-xl text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                        Question #{idx + 1}
                      </span>
                      {ans.answeredAt && (
                        <span className="text-[10px] text-slate-500">
                          {new Date(ans.answeredAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                      {ans.questionText}
                    </h4>

                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-rose-200 font-medium text-sm sm:text-base">
                      "{ans.answerText}"
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
