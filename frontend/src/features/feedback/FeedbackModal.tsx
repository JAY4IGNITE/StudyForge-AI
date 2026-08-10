import React, { useState } from 'react';
import { apiClient } from '../../lib/axios';
import { MessageSquare, Star, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { AnimatedButton as Button } from '../../components/motion';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { cn } from '../../lib/utils';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('platform');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await apiClient.post('/feedback', { category, rating, comment });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setComment('');
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Failed to submit feedback', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl">
        {submitted ? (
          <div className="space-y-3 py-8 text-center">
            <div className="mb-1 inline-flex rounded-2xl bg-gold/15 p-3 text-gold">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl font-medium text-foreground">Thank you!</h3>
            <p className="text-sm text-muted-foreground">Your feedback helps us make StudyForge AI even better.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-ember/15 p-2.5 text-ember">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium text-foreground">Share feedback</h3>
                <p className="text-xs text-muted-foreground">Tell us how we can improve your learning experience</p>
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">General platform</SelectItem>
                  <SelectItem value="practice">Practice questions</SelectItem>
                  <SelectItem value="interview">Mock interview</SelectItem>
                  <SelectItem value="bug">Report a bug</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rating
              </Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={cn(
                      'rounded-lg p-2 transition-all',
                      star <= rating ? 'bg-gold/10 text-gold' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Comments
              </Label>
              <Textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or think we can polish?"
              />
            </div>

            <Button type="submit" disabled={loading || !comment.trim()} className="w-full">
              {loading ? 'Submitting...' : 'Submit feedback'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
