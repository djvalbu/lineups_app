const STATE_KEY='opponentLineup.v2_2.state';
const SCOUT_KEY='opponentLineup.v2_2.scouting';
const EVENT_TYPES={GOAL_FOR:'GOAL_FOR',GOAL_AGAINST:'GOAL_AGAINST',YELLOW_CARD:'YELLOW_CARD',YELLOW_ACCUM_4:'YELLOW_ACCUM_4',RED_CARD:'RED_CARD',INJURY:'INJURY',LEFT_CLUB:'LEFT_CLUB',NEW_SIGNING:'NEW_SIGNING'};
const EVENT_META={
  GOAL_FOR:{label:'Goal',icon:'assets/icons/goal_for.png',minute:true,color:'#0433FF'},
  GOAL_AGAINST:{label:'Goal Against',icon:'assets/icons/goal_against.png',minute:true,color:'#FF1900'},
  YELLOW_CARD:{label:'Yellow Card',icon:'assets/icons/yellow_card.png'},
  YELLOW_ACCUM_4:{label:'4 Yellow Accumulation',icon:'assets/icons/yellow_accum_4.png'},
  RED_CARD:{label:'Red Card',icon:'assets/icons/red_card.png'},
  INJURY:{label:'Injury',icon:'assets/icons/injury.png'},
  LEFT_CLUB:{label:'Left Club',icon:'assets/icons/left_club.png'},
  NEW_SIGNING:{label:'New Signing',icon:'assets/icons/new_signing.png'}
};
// Horizontal x values are the FINAL field percentages (no extra compression).
// 2-player lines stay symmetric around 50%; 4-player lines are equally justified.
// 5-player lines use 3-up / 2-down vertical staggering to preserve full PlayerCard size.
const FORMATIONS={
 '1-4-4-2':[{label:'ST',x:38,y:8},{label:'ST',x:62,y:8},{label:'LM',x:13.5,y:34.7},{label:'CM',x:37.833,y:34.7},{label:'CM',x:62.167,y:34.7},{label:'RM',x:86.5,y:34.7},{label:'LB',x:13.5,y:61.3},{label:'CB',x:37.833,y:61.3},{label:'CB',x:62.167,y:61.3},{label:'RB',x:86.5,y:61.3},{label:'GK',x:50,y:88}],
 '1-4-3-3':[{label:'LW',x:19,y:8},{label:'ST',x:50,y:8},{label:'RW',x:81,y:8},{label:'CM',x:25,y:34.7},{label:'CM',x:50,y:34.7},{label:'CM',x:75,y:34.7},{label:'LB',x:13.5,y:61.3},{label:'CB',x:37.833,y:61.3},{label:'CB',x:62.167,y:61.3},{label:'RB',x:86.5,y:61.3},{label:'GK',x:50,y:88}],
 '1-4-2-3-1':[{label:'ST',x:50,y:8},{label:'LW',x:19,y:28},{label:'CAM',x:50,y:28},{label:'RW',x:81,y:28},{label:'CDM',x:38,y:48},{label:'CDM',x:62,y:48},{label:'LB',x:13.5,y:68},{label:'CB',x:37.833,y:68},{label:'CB',x:62.167,y:68},{label:'RB',x:86.5,y:68},{label:'GK',x:50,y:88}],
 '1-3-5-2':[{label:'ST',x:38,y:8},{label:'ST',x:62,y:8},{label:'LWB',x:13.5,y:31.2},{label:'CM',x:31.75,y:38.2},{label:'CM',x:50,y:31.2},{label:'CM',x:68.25,y:38.2},{label:'RWB',x:86.5,y:31.2},{label:'CB',x:22,y:61.3},{label:'CB',x:50,y:61.3},{label:'CB',x:78,y:61.3},{label:'GK',x:50,y:88}],
 '1-5-3-2':[{label:'ST',x:38,y:8},{label:'ST',x:62,y:8},{label:'CM',x:25,y:34.7},{label:'CM',x:50,y:34.7},{label:'CM',x:75,y:34.7},{label:'LWB',x:13.5,y:57.8},{label:'CB',x:31.75,y:64.8},{label:'CB',x:50,y:57.8},{label:'CB',x:68.25,y:64.8},{label:'RWB',x:86.5,y:57.8},{label:'GK',x:50,y:88}],
 '1-4-1-4-1':[{label:'ST',x:50,y:8},{label:'LM',x:13.5,y:28},{label:'CM',x:37.833,y:28},{label:'CM',x:62.167,y:28},{label:'RM',x:86.5,y:28},{label:'CDM',x:50,y:48},{label:'LB',x:13.5,y:68},{label:'CB',x:37.833,y:68},{label:'CB',x:62.167,y:68},{label:'RB',x:86.5,y:68},{label:'GK',x:50,y:88}],
 '1-3-4-3':[{label:'LW',x:19,y:8},{label:'ST',x:50,y:8},{label:'RW',x:81,y:8},{label:'LM',x:13.5,y:34.7},{label:'CM',x:37.833,y:34.7},{label:'CM',x:62.167,y:34.7},{label:'RM',x:86.5,y:34.7},{label:'CB',x:22,y:61.3},{label:'CB',x:50,y:61.3},{label:'CB',x:78,y:61.3},{label:'GK',x:50,y:88}],
 '1-5-4-1':[{label:'ST',x:50,y:8},{label:'LM',x:13.5,y:34.7},{label:'CM',x:37.833,y:34.7},{label:'CM',x:62.167,y:34.7},{label:'RM',x:86.5,y:34.7},{label:'LWB',x:13.5,y:57.8},{label:'CB',x:31.75,y:64.8},{label:'CB',x:50,y:57.8},{label:'CB',x:68.25,y:64.8},{label:'RWB',x:86.5,y:57.8},{label:'GK',x:50,y:88}]
};
const SUBS_GRID=[{label:'FW',x:13.5,y:8},{label:'FW',x:37.833,y:8},{label:'FW',x:62.167,y:8},{label:'FW',x:86.5,y:8},{label:'AM',x:13.5,y:28},{label:'AM',x:37.833,y:28},{label:'AM',x:62.167,y:28},{label:'AM',x:86.5,y:28},{label:'CM',x:13.5,y:48},{label:'CM',x:37.833,y:48},{label:'CM',x:62.167,y:48},{label:'CM',x:86.5,y:48},{label:'DEF',x:13.5,y:68},{label:'DEF',x:37.833,y:68},{label:'DEF',x:62.167,y:68},{label:'DEF',x:86.5,y:68},{label:'GK',x:50,y:88}];

