import React from "react";
import styled from "styled-components";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const Card = styled.div`
  background: var(--card-color);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-5px);
  }

  .label {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .value {
    display: block;
    font-size: 1.8rem;
    font-family: "Rajdhani";
    font-weight: 800;
    margin: 10px 0;
    color: var(--text-color);
  }
  .indicator {
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 4px;
    &.up {
      color: var(--success-color);
    }
    &.down {
      color: var(--error-color);
    }
  }
`;

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  trend,
  trendLabel,
}: StatCardProps) => (
  <Card>
    <div className="label">
      {icon} {label}
    </div>
    <span className="value">{value}</span>
    {trend !== undefined && (
      <div className={`indicator ${trend >= 1 ? "up" : "down"}`}>
        {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(trend)}% {trendLabel}
      </div>
    )}
  </Card>
);
