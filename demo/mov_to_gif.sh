INPUT=$1
OUTPUT=$1
ffmpeg -i $INPUT.mov -pix_fmt rgb8 -r 10 $OUTPUT.gif && gifsicle -U $OUTPUT.gif `seq -f "#%g" 0 2 2000` -O3 $OUTPUT.gif -o $OUTPUT.gif
