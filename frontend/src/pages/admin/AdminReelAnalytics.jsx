import { useState, useEffect } from 'react';
import { reelsAPI, adminAPI } from '../../api';
import { Play, Eye, Heart, MessageCircle, TrendingUp, RefreshCw, ExternalLink, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const fmt = n => {
  if (!n) return '0';
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1)+'M';
  if (n >= 1_000)     return (n/1_000).toFixed(1)+'K';
  return String(n);
};

export default function AdminReelAnalytics() {
  const [campaigns, setCampaigns]   = useState([]);
  const [selected,  setSelected]    = useState('');
  const [reels,     setReels]       = useState([]);
  const [summary,   setSummary]     = useState(null);
  const [loading,   setLoading]     = useState(false);
  const [camLoading,setCamLoading]  = useState(true);

  // Load all campaigns
  useEffect(() => {
    adminAPI.campaigns({ limit: 100 })
      .then(d => setCampaigns(d.campaigns || []))
      .catch(() => toast.error('Failed to load campaigns'))
      .finally(() => setCamLoading(false));
  }, []);

  // Load reels when campaign selected
  const loadReels = async (campaignId) => {
    if (!campaignId) return;
    setLoading(true);
    try {
      const d = await reelsAPI.getCampaignReels(campaignId);
      setReels(d.reels || []);
      setSummary(d.summary || null);
    } catch {
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelected(id);
    setReels([]);
    setSummary(null);
    if (id) loadReels(id);
  };

  return (
    <div style={{ padding:24, maxWidth:1000, margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
        <div style={{
          width:44, height:44, borderRadius:12,
          background:'linear-gradient(135deg,var(--p),var(--acc))',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Play size={20} color="#fff" fill="#fff"/>
        </div>
        <div>
          <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'var(--t1)' }}>Reel Analytics</h1>
          <p style={{ margin:'2px 0 0', fontSize:13, color:'var(--t3)' }}>
            Har campaign ke creators ki reels ka engagement dekho
          </p>
        </div>
      </div>

      {/* Campaign Selector */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:20, marginBottom:20 }}>
        <label style={{ fontSize:12, fontWeight:700, color:'var(--t2)', display:'block', marginBottom:8 }}>
          Campaign Select Karo
        </label>
        {camLoading ? (
          <div style={{ color:'var(--t3)', fontSize:13 }}>Loading campaigns…</div>
        ) : (
          <select
            value={selected}
            onChange={e => handleSelect(e.target.value)}
            style={{
              width:'100%', padding:'10px 14px', borderRadius:10,
              border:'1px solid var(--border)', background:'var(--bg)',
              color:'var(--t1)', fontSize:14, outline:'none',
            }}
          >
            <option value="">— Campaign choose karo —</option>
            {campaigns.map(c => (
              <option key={c._id} value={c._id}>
                {c.title} ({c.workflowStatus}) — {c.assignedCreators?.length || 0} creators
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign:'center', padding:40, color:'var(--t3)' }}>
          <Loader size={24} style={{ animation:'spin 1s linear infinite', marginBottom:8 }}/>
          <div>Loading reels…</div>
        </div>
      )}

      {/* No reels */}
      {!loading && selected && reels.length === 0 && (
        <div style={{
          background:'var(--card)', border:'1px solid var(--border)',
          borderRadius:14, padding:40, textAlign:'center',
        }}>
          <Play size={36} color="var(--t3)" style={{ marginBottom:12 }}/>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--t1)', marginBottom:6 }}>
            Koi reel nahi mili
          </div>
          <div style={{ fontSize:13, color:'var(--t3)' }}>
            Is campaign ke creators ne abhi koi reel submit nahi ki
          </div>
        </div>
      )}

      {/* Summary + Reels */}
      {!loading && summary && reels.length > 0 && (
        <>
          {/* Summary Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { icon: Eye,           label:'Total Views',    value: fmt(summary.totalViews),    color:'#60a5fa' },
              { icon: Heart,         label:'Total Likes',    value: fmt(summary.totalLikes),    color:'#f472b6' },
              { icon: MessageCircle, label:'Total Comments', value: fmt(summary.totalComments), color:'#a78bfa' },
              { icon: TrendingUp,    label:'Avg Engagement', value: `${summary.avgEngagement}%`,color:'#34d399' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{
                background:'var(--card)', border:'1px solid var(--border)',
                borderRadius:12, padding:'16px', textAlign:'center',
              }}>
                <Icon size={16} color={color} style={{ marginBottom:8 }}/>
                <div style={{ fontSize:20, fontWeight:800, color:'var(--t1)' }}>{value}</div>
                <div style={{ fontSize:11, color:'var(--t3)', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Reels Table */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', fontSize:13, fontWeight:700, color:'var(--t1)' }}>
              {reels.length} Reels — Sab Creators
            </div>
            {reels.map((reel, i) => (
              <div key={reel._id} style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'14px 18px',
                borderBottom: i < reels.length-1 ? '1px solid var(--border)' : 'none',
              }}>
                {/* Thumbnail */}
                {reel.thumbnail ? (
                  <img src={reel.thumbnail} alt="" style={{ width:48, height:48, borderRadius:10, objectFit:'cover', flexShrink:0 }}
                    onError={e => e.target.style.display='none'}/>
                ) : (
                  <div style={{ width:48, height:48, borderRadius:10, background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Play size={18} color="var(--t3)"/>
                  </div>
                )}

                {/* Creator + Caption */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--t1)', marginBottom:2 }}>
                    @{reel.addedBy?.displayName || reel.addedBy?.handle || reel.username || 'Creator'}
                  </div>
                  <div style={{ fontSize:11, color:'var(--t3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {reel.caption?.slice(0,80) || reel.shortcode}
                  </div>
                  <div style={{ fontSize:10, color:'var(--t3)', marginTop:2 }}>
                    Source: {reel.dataSource || 'unknown'}
                    {reel.dataSource === 'estimated' && ' ⚠️'}
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display:'flex', gap:16, alignItems:'center', flexShrink:0 }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#60a5fa' }}>{fmt(reel.views)}</div>
                    <div style={{ fontSize:9, color:'var(--t3)' }}>Views</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#f472b6' }}>{fmt(reel.likes)}</div>
                    <div style={{ fontSize:9, color:'var(--t3)' }}>Likes</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#a78bfa' }}>{fmt(reel.comments)}</div>
                    <div style={{ fontSize:9, color:'var(--t3)' }}>Comments</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:14, fontWeight:800, color:'#34d399' }}>{reel.engagement}%</div>
                    <div style={{ fontSize:9, color:'var(--t3)' }}>Eng%</div>
                  </div>
                  <a href={reel.url} target="_blank" rel="noreferrer"
                    style={{ color:'var(--t3)', padding:4 }}>
                    <ExternalLink size={14}/>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
