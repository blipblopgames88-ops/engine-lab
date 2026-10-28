class EngineProcessor extends AudioWorkletProcessor {
  constructor(){super();this.cfg={cylinders:8,displacement:5,pattern:'cross',idle:850,limit:7000,inertia:.25,throttle:0,variation:12};this.on=false;this.rpm=0;this.phase=0;this.voices=[];this.seed=7421;this.frames=0;this.port.onmessage=e=>{if(e.data.config)Object.assign(this.cfg,e.data.config);if(typeof e.data.on==='boolean')this.on=e.data.on;};}
  random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)|0;return (this.seed>>>0)/4294967296;}
  process(inputs,outputs){let out=outputs[0],c=this.cfg;for(let i=0;i<out[0].length;i++){
    const target=this.on?c.idle+(c.limit-c.idle)*Math.pow(c.throttle/100,.72):0;
    const tau=(target>this.rpm?.22:.42)+c.inertia*1.8;
    this.rpm+=(target-this.rpm)/(sampleRate*tau);
    this.phase+=this.rpm/(120*sampleRate);
    if(this.phase>=1)this.phase-=1;
    let prev=this.phase-this.rpm/(120*sampleRate);if(prev<0)prev+=1;
    for(let k=0;k<c.cylinders;k++){
      let position=k/c.cylinders;
      if(c.pattern==='twin'&&c.cylinders===2)position=k===0?0:315/720;
      if(c.pattern==='cross'&&c.cylinders===8)position=[0,90,180,270,360,450,540,630][k]/720;
      if((prev<=this.phase?position>prev&&position<=this.phase:position>prev||position<=this.phase)&&this.on&&this.rpm>50){
        const cut=this.rpm>c.limit-100&&c.throttle>97&&this.random()<.65;
        if(!cut)this.voices.push({t:0,amp:(.3+.7*c.throttle/100)*(1+(this.random()-.5)*c.variation/50),bank:c.pattern==='cross'?[0,1,1,0,1,0,0,1][k%8]:k%2});
      }
    }
    let left=0,right=0;
    for(let j=this.voices.length-1;j>=0;j--){const v=this.voices[j],t=v.t;const decay=.009+.006*Math.sqrt(c.displacement/c.cylinders);const f=95+110/Math.sqrt(c.displacement/c.cylinders);const impulse=(1-Math.exp(-t*5000))*Math.exp(-t/decay);const s=v.amp*impulse*(Math.sin(t*f*6.283)*.7+Math.sin(t*f*12.566)*.2+(this.random()-.5)*.22);left+=s*(v.bank?.5:1);right+=s*(v.bank?1:.5);v.t+=1/sampleRate;if(v.t>decay*9)this.voices.splice(j,1);}
    const intake=(this.random()-.5)*.025*(c.throttle/100)*Math.min(1,this.rpm/700);
    out[0][i]=Math.tanh(left*.7)+intake;if(out[1])out[1][i]=Math.tanh(right*.7)+intake;
  }this.frames+=out[0].length;if(this.frames>sampleRate/30){this.port.postMessage({rpm:this.rpm,phase:this.phase});this.frames=0;}return true;}
}
registerProcessor('engine-processor',EngineProcessor);
