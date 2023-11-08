# Chuong trinh: Tạo ra ba số thực ngẫu nhiên
# Ten File: Mn_2113363.asm
# Họ Tên: TRAN MINH HIEU
#-----------------------------------
# Data segment
	.data
# Cac dinh nghia bien
so10:		.float 10000000.0
float1:		.float 0.0
float2:		.float 0.0
float3:		.float 0.0
dulieu1:	.asciiz	"0000000"	
dulieu2:	.asciiz	"0000000"
dulieu3:	.asciiz	"0000000"
tenfile:	.asciiz	"C:\\Users\\HIEU\\Desktop\\BTL_KTMT_N1\\SOTHUC.TXT"
fdescr:	.word	0	
# Cac cau nhac nhap du lieu
str_tc:	.asciiz	"Thanh cong."
cau_nhac1:	.asciiz "So 1: 0."
cau_nhac2:	.asciiz "So 2: 0."
cau_nhac3:	.asciiz "So 3: 0."
str_endl:	.asciiz "\n"
str_loi:	.asciiz	"Mo file bi loi."
#-----------------------------------
# Code segment
	.text
	.globl	main
#-----------------------------------
# Chuong trinh chinh
#-----------------------------------
main:	
# Nhap (syscall)
# Random 3 float:
# random float 1
  	jal random_number	
  	swc1 $f0,float1
  	# get 9 digits
  	lwc1 $f0, so10
 	lwc1 $f2, float1
 	jal Get9digits
	la $a1,dulieu1 
 	jal int2str
 	
 # random float 2
 	jal random_number	
	swc1 $f0,float2
  	# get 9 digits
 	lwc1 $f0, so10
 	lwc1 $f2, float2
 	jal Get9digits
  	la $a1,dulieu2
  	jal int2str
  	
  # random float 3
  	jal random_number	
  	swc1 $f0,float3
  	# get 9 digits
  	lwc1 $f0, so10
  	lwc1 $f2, float3
  	jal Get9digits
  	la $a1,dulieu3
  	jal int2str
  
  # write file
  	jal write_to_txt
   
 
# Xuat ket qua (syscall)
# Ket thuc chuong trinh (syscall)
Kthuc:	addiu	$v0,$zero,10
	syscall 
#---------------------------------------------------
# function write_to_txt: write the results in file .txt
# input: dulieu1: float 1, dulieu2: float 2, dulieu3: float 3, 
# output: file SOTHUC.TXT
#---------------------------------------------------
write_to_txt:
# Xu ly
	la	$a0,tenfile
	addi	$a1,$zero,1	# open with write-only
	addi	$v0,$zero,13
	syscall
	bltz	$v0,baoloi
	sw	$v0,fdescr
    #cau nhac 1
  	lw	$a0,fdescr	# file descriptor
  	la	$a1,cau_nhac1
  	addi	$a2,$zero,8
  	addi	$v0,$zero,15
  	syscall
    #dulieu1
  	la	$a1,dulieu1
  	addi	$a2,$zero,7
  	addi	$v0,$zero,15
  	syscall
  	#in xuong dong
  	la	$a1,str_endl
  	addi	$a2,$zero,1
  	addi	$v0,$zero,15
  	syscall
    #cau nhac 2
  	la	$a1,cau_nhac2
  	addi	$a2,$zero,8
  	addi	$v0,$zero,15
  	syscall
    #dulieu2
  	la	$a1,dulieu2
  	addi	$a2,$zero,7
  	addi	$v0,$zero,15
  	syscall
  	#in xuong dong
  	la	$a1,str_endl
  	addi	$a2,$zero,1
  	addi	$v0,$zero,15
  	syscall
    #cau nhac 3
  	la	$a1,cau_nhac3
  	addi	$a2,$zero,8
  	addi	$v0,$zero,15
  	syscall
    #dulieu3
  	la	$a1,dulieu3
  	addi	$a2,$zero,7
  	addi	$v0,$zero,15
  	syscall
  	# dong file
	lw	$a0,fdescr
	addi	$v0,$zero,16
	syscall
	la	$a0,str_tc
	addi	$v0,$zero,4
	syscall
	j	Kthuc
baoloi:	la	$a0,str_loi
	addi	$v0,$zero,4
	syscall
  	jr $ra
 #---------------------------------------------------
# ham random_number: tao so ngau nhien theo thoi gian
# input: 
# output: $f0: so ngau nhi�n
#---------------------------------------------------
random_number:
# set seed
	li $v0, 40
	syscall
	# theo time
	li $v0, 30
	syscall
	# random float:
	li $v0, 43
	syscall
	jr $ra
	
Get9digits:
	mul.s $f2,$f2,$f0
 	cvt.w.s $f2, $f2
	mfc1 $t0,$f2
	move $a0,$t0
	jr $ra
	
# inputs : $a0 -> integer to convert
#          $a1 -> address of string where converted number will be kept
# outputs: none
int2str:
	addi $sp, $sp, -4         # to avoid headaches save $t- registers used in this procedure on stack
	sw   $t0, ($sp)           # so the values don't change in the caller. We used only $t0 here, so save that.
	bltz $a0, neg_num         # is num < 0 ?
	j    next0                # else, goto 'next0'

neg_num:                  # body of "if num < 0:"
	li   $t0, '-'
	sb   $t0, ($a1)           # *str = ASCII of '-' 
	addi $a1, $a1, 1          # str++
	li   $t0, -1
	mul  $a0, $a0, $t0        # num *= -1

next0:
	li   $t0, -1
	addi $sp, $sp, -4         # make space on stack
	sw   $t0, ($sp)           # and save -1 (end of stack marker) on MIPS stack

push_digits:
	blez $a0, next1           # num < 0? If yes, end loop (goto 'next1')
	li   $t0, 10              # else, body of while loop here
	div  $a0, $t0             # do num / 10. LO = Quotient, HI = remainder
	mfhi $t0                  # $t0 = num % 10
	mflo $a0                  # num = num // 10  
	addi $sp, $sp, -4         # make space on stack
	sw   $t0, ($sp)           # store num % 10 calculated above on it
	j    push_digits          # and loop

next1:
	lw   $t0, ($sp)           # $t0 = pop off "digit" from MIPS stack
	addi $sp, $sp, 4          # and 'restore' stack

	bltz $t0, neg_digit       # if digit <= 0, goto neg_digit (i.e, num = 0)
	j    pop_digits           # else goto popping in a loop

neg_digit:
	li   $t0, '0'
	sb   $t0, ($a1)           # *str = ASCII of '0'
	addi $a1, $a1, 1          # str++
	j    next2                # jump to next2

pop_digits:
	bltz $t0, next2           # if digit <= 0 goto next2 (end of loop)
	addi $t0, $t0, '0'        # else, $t0 = ASCII of digit
	sb   $t0, ($a1)           # *str = ASCII of digit
	addi $a1, $a1, 1          # str++
	lw   $t0, ($sp)           # digit = pop off from MIPS stack 
	addi $sp, $sp, 4          # restore stack
	j    pop_digits           # and loop

next2:
	sb  $zero, ($a1)          # *str = 0 (end of string marker)
	lw   $t0, ($sp)           # restore $t0 value before function was called
	addi $sp, $sp, 4          # restore stack
	jr  $ra                   # jump to caller
