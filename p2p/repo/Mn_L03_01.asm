#Bai Tap Lon KTMT 2022
#Nhom 01
#De 01

#----------------------
# Data segment
#----------------------
.data
	file: 		.asciiz "INT2.BIN"
	Array_64: 	.space 64
	answer: 	.asciiz "  Ket qua la (2):  "
	High_32bit: 	.asciiz "  High 32_bit:                                      "
	Low_32bit: 	.asciiz "  Low 32_bit:                                       "
	str_space:	.asciiz " "
	str_endl: 	.asciiz "\n"
	multiplier: 	.asciiz "  Multiplier_2:                                     "	
	multiplicand: 	.asciiz "  Multiplicand_2:                                   "
	multiplier_10: 		.asciiz "  Multiplier:_10:                                   "	
	multiplicand_10: 	.asciiz "  Multiplicand:_10:                                 "
#------------------------
# Code segment
#------------------------
	.text
	.globl main
#------------------------
# Main program
#------------------------

main:
# Handle file
	jal file_handle
# Convert string in Array_64
# 1. Store first binary in $s1
	jal first_binary
# 2. Store second binary in $s3
	jal second_binary
# 3. Multiply agorithm
# s1 = multiplicand
# s3 = multiplier
# product = $s5$s4 ($s5: 32 bit MSB ; $s4: 32 bit LSB )	

# Luu tru cac gia tri vao thanh ghi tam thoi
   # Lưu original sign multiplicand -> s6 , multiplier -> s7
   	move 	$t0, $s1
   	jal 	store_sign
   	move	$s6 , $v0
   	
   	move 	$t0, $s3
   	jal 	store_sign
   	move	$s7 , $v0
   # Convert to positive integer
   	beqz 	$s6 , next
   	move 	$a0 , $s1
   	jal 	Bu_2
   	move 	$s1 , $v0
   	next:
   	beqz 	$s7 , nextt
   	move 	$a0 , $s3
   	jal 	Bu_2
   	move 	$s3 , $v0	
   	nextt:
   # multiplicand register 64 bit, 32 bit cao t2, 32 bit thap t1
	move 	$t1, $s1
	move 	$t2, $zero
   # multiplier register 32 bit
	move 	$t3, $s3
   # multiplier 0 = t6
   	move 	$t6, $zero
   # index: $t0 (0->31)
	move 	$t0, $zero
# Multiply agorithm run by for
for:
	beq 	$t0, 32, out_loop
   # finding LSB of multiplier 
   	
   	move 	$a0, $t3
   	jal	LSB_multiplier
   	move	$t6, $v0 		# t6 = LSB of multiplier
   	
   #if $t6 =0, shift left multiplicand then shift right multiplier
	beqz 	$t6, shift_L_R
   #else: add multiplicand 64 bit to result register 64 bit
   
      # store result in t4 before do result + multip	licand
      	move 	$t4, $s4
      # result += multiplicand (32 bit thap)
      	addu 	$s4, $s4, $t1
      	
      #detect carry flag
      #if(s4_new < s4_old AND s4_new < t1) => carry flag on
      	# t8 = (s4_new < s4_old) ? 1: 0
      	sltu 	$t8, $s4, $t4
      	# t9 = (s4_new < t1) ? 1 : 0
      	sltu 	$t9, $s4, $t1
      	# t8 = t8 AND t9
      	and 	$t8, $t8, $t9
      # result += multiplicand (32 bit cao)
      	addu 	$s5, $s5, $t2
      # add carry
      	addu 	$s5, $s5, $t8
# Shift bit
shift_L_R:
   #multiplicand register 64 bit, 32 bit cao t2, 32 bit thap t1
   
   	move 	$a0, $t1
   	jal	MSB_multiplicand 		#t7 = MSB cua t1
   	move	$t7, $v0
   	
   #shift multiplicand left 1 bit
   	sll 	$t1, $t1, 1
   	sll 	$t2, $t2, 1
   	addu 	$t2, $t2, $t7
   	
   #shift multiplier right 1 bit
   	srl 	$t3, $t3, 1
   #increase i, and continue loop
   	addu 	$t0, $t0, 1
   	j for
	
#End of for
out_loop:
   # convert the product to the original sign
   	beqz 	$s6 , next1
   	move 	$a0 , $s1
   	jal 	Bu_2
   	move 	$s1 , $v0
next1:
   	beqz 	$s7 , next2
   	move 	$a0 , $s3
   	jal 	Bu_2
   	move 	$s3 , $v0	
next2:
   # convert the product to the correct sign	
	xor 	$t0 , $s6 , $s7
	beqz 	$t0 , nexttt
	jal 	Bu_2_product
nexttt:

   # Ket qua hệ 10
   
  
   # print product of Multiply agorithm by binary
   # Print Multiplicand
   	la 		$a0,multiplicand
   	li 		$v0,4
   	syscall
   	add 		$a0, $zero, $s1 
	addi 		$v0, $zero, 35
	syscall
	la 		$a0,str_endl
	li		$v0,4
	syscall
   # Print Multiplier
   	la 		$a0,multiplier
   	li 		$v0,4
   	syscall
   	
   	add 		$a0, $zero, $s3
	addi 		$v0, $zero, 35
	syscall
	
	la 		$a0,str_endl
	li		$v0,4
	syscall
   # Print Multiplicand hệ thập phân
   	la 		$a0,multiplicand_10
   	li 		$v0,4
   	syscall
   	add 		$a0, $zero, $s1 
	addi 		$v0, $zero, 1
	syscall
	la 		$a0,str_endl
	li		$v0,4
	syscall
   # Print Multiplier hệ thập phân
   	la 		$a0,multiplier_10
   	li 		$v0,4
   	syscall
   	
   	add 		$a0, $zero, $s3
	addi 		$v0, $zero, 1
	syscall
	
	la 		$a0,str_endl
	li		$v0,4
	syscall
   #print Product
   	la 	$a0, answer
	addi 	$v0, $zero, 4
	syscall
	   
   	add 	$a0, $zero, $s5  
	addi 	$v0, $zero, 35
	syscall

	la 	$a0, str_space
	addi 	$v0, $zero, 4
	syscall
	
	add 	$a0, $zero, $s4  
	addi 	$v0, $zero, 35
	syscall
	
	la 		$a0,str_endl
	li		$v0,4
	syscall
	
	la 	$a0, High_32bit
	addi 	$v0, $zero, 4
	syscall
		   
   	add 	$a0, $zero, $s5  
	addi 	$v0, $zero, 1
	syscall

	la 	$a0, str_endl
	addi 	$v0, $zero, 4
	syscall
	
	la 	$a0, Low_32bit
	addi 	$v0, $zero, 4
	syscall
	
	add 	$a0, $zero, $s4  
	addi 	$v0, $zero, 1
	syscall
	
	la 		$a0,str_endl
	li		$v0,4
	syscall
	
#End program
	li		$v0,10
	syscall

#-------------------------
#FUNCTION IN PROGRAM
#-------------------------
# 1. Ham xu li file
#-------------------------
file_handle:
#Open file
	addi	 	$v0, $zero,13
	la 		$a0,file
	addi 		$a1,$zero,0
	addi 		$a2,$zero,0
	syscall
	move 		$s0,$v0
#Read file
	addi 		$v0,$zero,14
	move 		$a0,$s0
	la 		$a1,Array_64
	addi 		$a2,$zero,64
	syscall
#Close file
	addi 		$v0,$zero,16
	move 		$a0,$s0
	syscall
	jr $ra
#----------------
# 2. Ham luu so nhi phan thu nhat vao $s1
#----------------	
first_binary:
	move 		$s1,$zero
	addi 		$t0,$zero,0   #index: from 0 to 31
	la 		$t1,Array_64
loop_first:
	beq		$t0, 32, out_loop1
	lb		$s2, 0($t1)
	# Convert ascii to binary
	addi		$s2, $s2, -48
	sll		$s1, $s1, 1
	or		$s1, $s1, $s2
	#increase t0
	addi		$t0, $t0, 1
	#increase t1 += 1
	addi		$t1, $t1, 1
	j loop_first
out_loop1:
	jr 		$ra
#-----------------
# 3. Ham luu so nhi phan thu 2 vao $s3
#-----------------	
second_binary:
	move	$s3, $zero
      #t0: bien chay (i=0 -> 31)
      	addi 	$t0, $zero, 0
	la	$t1, Array_64
	addi	$t1, $t1, 32
loop_second:
	beq	$t0, 32, out_loop2
	lb	$s2, 0($t1)
	#convert asciiz to binary
	addi	$s2, $s2, -48	
	sll	$s3, $s3, 1
	or	$s3, $s3, $s2
	#increase t0
	addi	$t0, $t0, 1
	#increase t1 += 1
	addi	$t1, $t1, 1
	j loop_second
out_loop2:
	jr 	$ra
#----------------
#Ham tim gia tri LSB cua Multiplier
#----------------
LSB_multiplier:
	addi	$a1, $zero, 2
	div 	$a0, $a1
	mfhi 	$a0
	move	$v0, $a0
	jr 	$ra
#----------------
#Ham tim gia tri MSB cua Multiplicand
#---------------- 
MSB_multiplicand:
   	srl 	$a0, $a0, 31
   	move	$v0, $a0
   	jr	$ra

store_sign: 
	srl 	$v0 , $t0 , 31
	jr 	$ra

Bu_2: 
	xori 	$a0, $a0, 0xffffffff
	addi 	$v0, $a0, 1
	jr  	$ra

Bu_2_product:
	li 	$t0, 0xffffffff
	xori 	$s4, $s4, 0xffffffff
	xori 	$s5, $s5, 0xffffffff
	bne	$s4, $t0, out 
	addi 	$s5, $s5 , 1	
out:
	addi 	$s5, $s5 , 1
	addi 	$s4, $s4, 1
	jr 	$ra	

Ket_qua_10:
	
	
