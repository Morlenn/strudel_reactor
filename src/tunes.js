const stranger_tune = `setcps(140/60/4)

samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

const gain_patterns = [
  "2",
  "{0.75 2.5}*4",
    "{0.75 2.5!9 0.75 2.5!5 0.75 2.5 0.75 2.5!7 0.75 2.5!3 <2.5 0.75> 2.5}%16",
]

const drum_structure = [
"~",
"x*4",
"{x ~!9 x ~!5 x ~ x ~!7 x ~!3 < ~ x > ~}%16",
]

const basslines = [
  "[[eb1, eb2]!16 [f2, f1]!16 [g2, g1]!16 [f2, f1]!8 [bb2, bb1]!8]/8",
  "[[eb1, eb2]!16 [bb2, bb1]!16 [g2, g1]!16 [f2, f1]!4 [bb1, bb2]!4 [eb1, eb2]!4 [f1, f2]!4]/8"
]

const arpeggiator1 = [
"{d4 bb3 eb3 d3 bb2 eb2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
"{d4 bb3 g3 d3 bb2 g2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
]

const arpeggiator2 = [
"{d4 bb3 eb3 d3 bb2 eb2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
"{d4 bb3 g3 d3 bb2 g2}%16",
"{d5 bb4 g4 d4 bb3 g3 d4 bb3 eb3 d3 bb2 eb2}%16",
]


const pattern = 0
const bass = 0

bassline:
note(pick(basslines, bass))
.sound("supersaw")
.postgain(2)
.room(0.6)
.lpf(700)
.room(0.4)
.postgain(pick(gain_patterns, pattern))


main_arp: 
note(pick(arpeggiator1, "<0 1 2 3>/2"))
.sound("supersaw")
.lpf(300)
.adsr("0:0:.5:.1")
.room(0.6)
.lpenv(3.3)
.postgain(pick(gain_patterns, pattern))


drums:
stack(
  s("tech:5")
  .postgain(6)
  .pcurve(2)
  .pdec(1)
  .struct(pick(drum_structure, pattern)),

  s("sh").struct("[x!3 ~!2 x!10 ~]")
  .postgain(0.5).lpf(7000)
  .bank("RolandTR808")
  .speed(0.8).jux(rev).room(sine.range(0.1,0.4)).gain(0.6),

  s("{~ ~ rim ~ cp ~ rim cp ~!2 rim ~ cp ~ < rim ~ >!2}%8 *2")
  .bank("[KorgDDM110, OberheimDmx]").speed(1.2)
  .postgain(.25),
)

drums2: 
stack(
  s("[~ hh]*4").bank("RolandTR808").room(0.3).speed(0.75).gain(1.2),
  s("hh").struct("x*16").bank("RolandTR808")
  .gain(0.6)
  .jux(rev)
  .room(sine.range(0.1,0.4))
  .postgain(0.5),
  
  s("[psr:[2|5|6|7|8|9|12|24|25]*16]?0.1")
  .gain(0.1)
  .postgain(pick(gain_patterns, pattern))
  .hpf(1000)
  .speed(0.5)
  .rarely(jux(rev)),
)
//Remixed and reproduced from Algorave Dave's code found here: https://www.youtube.com/watch?v=ZCcpWzhekEY
// all(x => x.gain(mouseX.range(0,1)))
all(x => x.log())

// @version 1.2`;

const bergheini = `// "Bergheini auf dem Weg nach Hause" @by $$$otter
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

setcps(2.5)

$: s("bd*4").struct("<[x ~ x x]!32 x x>")
.bank("Linn9000")
.velocity("<1 ~ .05 .1>*4")
.compressor("-10:8:10:0.14:3").gain(.8)
.room(.2)
.mask("<[1 1] 1 1 0 1!16>/32")

$: s("bd")
.bank('YamahaRM50')
.compressor("-10:8:10:0.14:3").gain(.7)
.mask("<[0 1] 1 1 0 1!16>/32")

$: s("hh*2").struct("<[~ x]!16 x*4 x*8>")
.bank("OberheimDMX")
.velocity("<[.05 .07 .08] .15>")
.compressor("-20:20:10:3:6").gain(.35)
.room(.8).roomsize(.5)
.mask("<[0 0] 1 1 1 1!16>/32")

$: chord("<Am Am7 C Gm>/8").dict('ireal').anchor('A3')
.voicing()
.sound('gm_ocarina')
.off(.2, x=>x.velocity("<.4 .2 .3>*16"))
.room(.8)
.delay(.1)
.gain("<0 0 [.3 .4.5 .6] .7 .7!16>/32")
.mask("<[0 0] 0 1 1 1!16>/32".early(.05))

$: n("[1 2 4 7]").chord("<Am Gm>/8").dict('ireal')
.voicing()
.sound("sine")
.fm("1 3 5")
.fmattack(".3 .7 2")
.fmh("1 5 7 9")
.velocity(.66)
.room("<1 3!8>/16")
.mask("<[0 0] 0 0 1 1!16>/32".early(.05))

$: n("[1 2 4 7] [1 3 8]".euclid(3,8)).chord("<Am Gm>/8").dict('ireal')
.voicing()
.sound("sine")
.fm("1 3 5")
.fmattack(.6)
.fmh(2)
.velocity(.66)
.room("<1 3!8>/16")
.mask("<[0 0] 0 0 0 1!16>/32".early(.05))

$: n("[[1 2 4 7] [1 3 8]] [[1 2 4 5 7] [1 3 8]]").sometimesBy(.4, x=>x.add(2))
.chord("<Am Gm Am7>").dict('ireal')
.voicing().slow(4)
.sound("square")
.fm("1 3 5")
.fmattack(.4)
.fmh(4)
.velocity(.33)
.room("<1 3!8>/16")
.mask("<[0 0] 0 0 0 0 1!5 0 1!4 0 1!3>/32".early(.05))



all(x=>x.gain(1.5))
// @version 1.1`;

const finance = `/* man in finance @by v10101a 
+ "das ist bass" @by enelg,froos
*/
setcpm(30)
samples({
  finance:  ['man-in-finance/finance_00.wav', 'man-in-finance/finance_01.wav', 'man-in-finance/finance_02.wav', 'man-in-finance/murrayhill.wav']
}, 'github:sandpills/v10101a-samples/main/');
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')


Finance1: n("<1 0>").s("finance").slow(2).clip(1)
  .mask("<1 1 1 0>/4")

Finance2: n("0").s("finance").slow(2).clip(1.4)
  .struct("1(<3 5>,8)")
  .mask("<0 0 0 1>/4").gain(0.8).room(1.2)

Supersaw: note("<a1 c2>/2")
.sound("supersaw")
.euclidLegato(9,16)
.ftype('24db')
.lpf(tri.rangex(2000,400).slow(8))
.lpenv(6)
.dist("2:.4")
.echo(2, 1/16, .7)
.mul(gain("[.5 1!3]*4")) //side chain
.add(note("<[0 5]*4 [5 10]*4>"))
// .hush()

Drum1: s("oh*16")
  .bank("RolandTR909")
  .decay(sine.range(.2,.4))
  .dist("1:.3")
  .mul(gain("[<0!3 1> .2 1 <0!3 .2>]*4")) //groove
  .mul(gain("[.2 1!3]*4")) //side chain
  .pan(tri.range(.7,.3))
  .hpf(800)
  .room(.1)
  .mask("<0 1>/8")
  // .hush()

Drum2: s("bd*4").bank('RolandTR909').dist("1:1")

.scope()
// @version 1.1`;

const euclid = `//"Euclid test" @by shadesDrawn

setcpm(30)
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

synth:("<[c2,c1] [ab0,ab1] [f0,f1] [g0,g1]>")
  .euclidRot(3,16,14)
  .sound("gm_synth_bass_2:1")
  .decay(1.2)
  .room(1)
  .gain(1.6)
  .pan(0.5)

sine:("<eb4 f4 g4 d4>")
  .euclidLegatoRot(3,16,14)
  .sound("sine")
  .fm(1)
  .crush(sine.range(7,14).slow(20))
  .release(0.4)
  .gain(0.35)
  .pan(0.7)

guitar1:(\`
[eb4 g3 d4 c4@2 d4 eb4 c4]
[d4 eb4 g3 d4 c4@2 d4 eb4]
[c4 d4 eb4 g3 d4 c4@2 d4]
[eb4 c4 d4 eb4 g3 d4 c4@2]
\`)
  .slow(4)
  .sound("gm_electric_guitar_clean:4")
  .decay(0.3)
  .crush(8)
  .gain(sine.range(0.1,0.5).slow(8))
  .pan(0.3)

guitar2:(\`
[g3 ab3 f3 g3 d4 eb4 c4 d4]
\`)
  .slow(1)
  .sound("gm_electric_guitar_clean:4")
  .decay(0.3)
  .crush(8)
  .gain(sine.range(0.4,0.1).slow(8))
  .pan(0.6)

drum1:("<bd [bd bd]> <bd ~> bd bd")
  .bank("RolandTR909")
  .gain(0.25)


drum2:("hh*8")
  .bank("RolandTR909")
  .gain(0.1)
  .degradeBy(0.33)


numbers:("<0 1 2 3 4 5 6 7 8 0 0>")
  .sound("numbers")
  .crush(10)
  .delay(0.5)
  .gain(sine.range(0.1,0.4).slow(15))
  .pan(sine.range(0,1).slow(10))
  .mask("<0!11 1!500>")

// @version 1.2`;

export { stranger_tune, bergheini, finance, euclid }