from pathlib import Path
import csv
import hashlib
import json
import math
import re
import subprocess
import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.linalg import spsolve
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
for directory in ('assets', 'data', 'evidence'):
    (ROOT / directory).mkdir(parents=True, exist_ok=True)
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 11, 'axes.spines.top': False, 'axes.spines.right': False, 'figure.facecolor': 'white', 'savefig.facecolor': 'white'})

def savefig(fig, name):
    fig.savefig(ROOT / 'assets' / (name + '.png'), dpi=180, bbox_inches='tight')
    fig.savefig(ROOT / 'assets' / (name + '.svg'), bbox_inches='tight')
    plt.close(fig)

def table(name, rows):
    with (ROOT / 'data' / name).open('w') as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys())
        w.writeheader()
        w.writerows(rows)

def field(n, height=6, upper=1):
    nx, ny = 4*n, 2*height*n+1
    x = np.arange(nx)/n
    y = np.arange(ny)/n-height
    ids = np.arange(nx*ny).reshape(ny,nx)
    erow = np.where(y < 0, 4.5, np.where(y > 0, upper, (4.5+upper)/2))
    edges_a = np.concatenate([ids.ravel(), ids[:-1].ravel()])
    edges_b = np.concatenate([np.roll(ids,-1,axis=1).ravel(), ids[1:].ravel()])
    weights = np.concatenate([np.repeat(erow,nx), np.repeat(np.where((y[:-1]+y[1:])/2 < 0,4.5,upper),nx)])
    a,b,w=edges_a,edges_b,weights
    mat=coo_matrix((np.concatenate([w,w,-w,-w]),(np.concatenate([a,b,a,b]),np.concatenate([a,b,b,a]))),shape=(nx*ny,nx*ny)).tocsr()
    pos=(x >= .5)&(x <= 1.5)
    neg=(x >= 2.5)&(x <= 3.5)
    fixed=np.concatenate([ids[height*n,pos],ids[height*n,neg]])
    vals=np.concatenate([np.full(pos.sum(),.5),np.full(neg.sum(),-.5)])
    free=np.ones(nx*ny,dtype=bool);free[fixed]=False
    v=np.zeros(nx*ny);v[fixed]=vals
    v[free]=spsolve(mat[free][:,free],-mat[free][:,fixed]@vals)
    residual=float(np.max(np.abs((mat@v)[free])))
    capacitance=8.8541878128e-12*np.sum(w*(v[a]-v[b])**2)
    return x,y,v.reshape(ny,nx),capacitance,residual

field_rows=[]
for n,h in [(10,6),(20,6),(40,6),(40,10)]:
    x,y,v,c,r=field(n,h)
    field_rows.append({'cells_per_finger_width':n,'half_height_in_widths':h,'capacitance_pF_per_m':c*1e12,'max_residual_relative_units':r})
table('ide-convergence.csv',field_rows)
x,y,v,c,r=field(40,6)
xx,yy=np.meshgrid(x*152.4,y*152.4)
fig,ax=plt.subplots(figsize=(9,4.4))
im=ax.contourf(xx,yy,v,levels=np.linspace(-.5,.5,31),cmap='RdBu_r')
ax.contour(xx,yy,v,levels=np.linspace(-.45,.45,10),colors='#444',linewidths=.45,alpha=.65)
for lo,hi,color in [(.5,1.5,'#b22222'),(2.5,3.5,'#174a7e')]:
    ax.plot(np.array([lo,hi])*152.4,[0,0],color=color,lw=7,solid_capstyle='butt')
ax.axhline(0,color='#444',lw=.6,ls=':')
ax.set(xlim=(0,609.6),ylim=(-320,320),xlabel='Across the fingers (µm)',ylabel='Height above board (µm)',title='One periodic IDE cell, 1 V between electrodes')
ax.text(12,285,'Air: εr = 1',fontsize=10)
ax.text(12,-290,'Substrate: εr = 4.5',fontsize=10)
fig.colorbar(im,ax=ax,label='Potential (V)')
fig.tight_layout();savefig(fig,'ide-potential')
decay=[]
for idx in np.flatnonzero(y>=0):
    decay.append({'height_um':float(y[idx]*152.4),'potential_peak_to_peak_V':float(np.ptp(v[idx]))})
table('ide-decay.csv',decay)
fig,ax=plt.subplots(figsize=(8,3.5))
ax.plot([r['height_um'] for r in decay],[r['potential_peak_to_peak_V'] for r in decay],color='#245c80',lw=2)
ax.set(xlim=(0,600),xlabel='Height above electrode plane (µm)',ylabel='Potential variation across cell (V)',title='The alternating potential fades with distance')
ax.grid(alpha=.2);fig.tight_layout();savefig(fig,'ide-decay')

spice=[]
factor=math.log((3.3-1.1)/(3.3-1.6))+math.log(1.6/1.1)
for cap,step in [(100e-12,.2e-9),(200e-12,1e-9),(200e-12,.2e-9),(200e-12,.1e-9),(400e-12,.2e-9)]:
    label=f'{cap*1e12:.0f}p-{step*1e9:g}ns'
    deck=f'''Ideal Schmitt RC oscillator
.param R=3000 C={cap:.12g}
Vdd supply 0 3.3
Rpull supply state 1k
S1 state 0 cap 0 schmitt OFF
.model schmitt SW(VT=1.35 VH=0.25 RON=0.001 ROFF=1e9)
Ebuffer out 0 state 0 1
Rtiming out cap {{R}}
Csensor cap 0 {{C}} IC=0
.options reltol=1e-5 abstol=1e-12 vntol=1e-7
.tran {step:.12g} 20u 0 {step:.12g} UIC
.control
run
meas tran t1 when v(cap)=1.35 rise=5
meas tran t2 when v(cap)=1.35 rise=15
let frequency=10/(t2-t1)
print frequency
set wr_singlescale
set wr_vecnames
wrdata data/spice-{label}.csv v(cap) v(out)
quit
.endc
.end
'''
    path=ROOT/'data'/f'oscillator-{label}.cir';path.write_text(deck)
    run=subprocess.run(['ngspice','-b',str(path)],cwd=ROOT,capture_output=True,text=True,check=True)
    (ROOT/'evidence'/f'spice-{label}.log').write_text(run.stdout+run.stderr)
    measured=float(re.search(r'frequency\s*=\s*([\d.eE+-]+)',run.stdout).group(1))
    theory=1/(3000*cap*factor)
    spice.append({'capacitance_pF':cap*1e12,'max_step_ns':step*1e9,'frequency_Hz':measured,'ideal_Hz':theory,'difference_percent':100*(measured/theory-1)})
table('spice-summary.csv',spice)
d=np.loadtxt(ROOT/'data/spice-200p-0.2ns.csv',skiprows=1)
keep=(d[:,0]>=8e-6)&(d[:,0]<=9.5e-6)
fig,ax=plt.subplots(figsize=(8,3.7))
ax.plot(d[keep,0]*1e6,d[keep,2],label='Output',color='#245c80',lw=1)
ax.plot(d[keep,0]*1e6,d[keep,1],label='Timing capacitor',color='#ae5224',lw=1.5)
for t in [1.1,1.6]:ax.axhline(t,color='#777',ls=':',lw=.8)
ax.set(xlabel='Simulation time (µs)',ylabel='Voltage (V)',title='3 kΩ, 200 pF; ideal hysteretic switch and output buffer')
ax.legend(loc='upper right',fontsize=9);fig.tight_layout();savefig(fig,'spice-waveform')

runs={}
stats=[]
manifest=[]
for name in ['2026-01-02_water-freeze-cycle','2026-01-03_water-freeze-cycle']:
    p=ROOT/'data'/f'{name}.csv'
    with p.open(newline='') as stream:
        rows=[]
        for record in csv.DictReader(stream):
            rows.append({key: value if key == 'timestamp' else int(value) if key in ('sample', 'fault') else float(value) for key, value in record.items() if key != 'elapsed_h'})
    manifest.append({'source':f'data/{p.name}','sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'rows':len(rows)})
    runs[name]=rows
for name,label in [('2026-01-02_water-freeze-cycle','January 2 cooling'),('2026-01-03_water-freeze-cycle','January 3 warming')]:
    rows=runs[name]
    times=np.array([np.datetime64(q['timestamp']) for q in rows])
    hours=(times-times[0])/np.timedelta64(1,'h')
    valid=np.array([q['fault']==0 for q in rows])
    stats.append({'run':label,'samples':len(rows),'fault_rows':int((~valid).sum()),'duration_h':float(hours[-1]),'start_C':rows[0]['temp_c'],'end_C':rows[-1]['temp_c'],'valid_min_C':min(q['temp_c'] for q in rows if q['fault']==0),'valid_max_C':max(q['temp_c'] for q in rows if q['fault']==0)})
    fig,axs=plt.subplots(3,1,figsize=(9,6.7),sharex=True)
    for ax,key,color,unit in zip(axs,['temp_c','freq_high','freq_low'],['#333333','#245c80','#ae5224'],['Temperature (°C)','freq_high (kHz)','freq_low (kHz)']):
        a=np.array([q[key] for q in rows],dtype=float)
        if key.startswith('freq'):a/=1000
        a[~valid]=np.nan
        ax.plot(hours,a,lw=.9,color=color)
        ax.set_ylabel(unit);ax.grid(alpha=.2)
    axs[0].axhline(0,color='#888',ls=':',lw=.7)
    axs[0].set_title(f'{label}: recorded channels, fault rows omitted')
    axs[-1].set_xlabel('Elapsed time (hours)')
    fig.tight_layout();savefig(fig,'cooling' if '01-02' in name else 'warming')
table('experiment-summary.csv',stats)
bins=[]
for name,label in [('2026-01-02_water-freeze-cycle','cooling'),('2026-01-03_water-freeze-cycle','warming')]:
    for lo,hi in [(-25,-20),(-10,-5),(0,5),(10,15)]:
        q=[r for r in runs[name] if r['fault']==0 and lo<=r['temp_c']<hi]
        bins.append({'run':label,'lower_C':lo,'upper_C_exclusive':hi,'samples':len(q),'median_freq_high_Hz':float(np.median([r['freq_high'] for r in q])),'median_freq_low_Hz':float(np.median([r['freq_low'] for r in q]))})
table('temperature-bins.csv',bins)
(ROOT/'evidence/source-manifest.json').write_text(json.dumps({'input_data':manifest,'field_model':'Illustrative periodic-cell model using the electrode dimensions documented in January 2026','ngspice_version':subprocess.run(['ngspice','--version'],capture_output=True,text=True,check=True).stdout.strip()},indent=2)+'\n')
print(json.dumps({'field':field_rows,'spice':spice,'experiments':stats,'bins':bins},indent=2))
