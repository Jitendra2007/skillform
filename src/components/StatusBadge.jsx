import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const { t } = useLanguage();

  const label = t(`statuses.${status}`) || status;

  let badgeClass = "badge-status-requested";
  let Icon = Clock;

  if (status === 'verified' || status === 'quote_accepted' || status === 'scheduled' || status === 'completed') {
    badgeClass = status === 'verified' ? "badge-verified" : "badge-status-completed";
    Icon = CheckCircle2;
  } else if (status === 'pending' || status === 'quoted') {
    badgeClass = status === 'pending' ? "badge-pending" : "badge-status-quoted";
    Icon = Clock;
  } else if (status === 'in_progress') {
    badgeClass = "badge-status-in_progress";
    Icon = Clock;
  } else if (status === 'rejected' || status === 'cancelled') {
    badgeClass = status === 'rejected' ? "badge-rejected" : "badge-status-cancelled";
    Icon = XCircle;
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <Icon size={13} />
      <span>{label}</span>
    </span>
  );
}
