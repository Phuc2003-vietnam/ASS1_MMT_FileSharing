# Chuong trinh: tao file
#-----------------------------------
# Data segment
	.data
# Cac dinh nghia bien
dulieu1:	.asciiz "00000000000001100001101010000000"
dulieu2:	.asciiz	"00000000000001100001101010000000"
INT2.BIN:	.asciiz	"INT2.BIN"
fdescr:	.word	0	
# Cac cau nhac nhap du lieu
str_tc:	.asciiz	"Thanh cong."
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
# Xu ly
	la	$a0,INT2.BIN
	addi	$a1,$zero,1	# open with write-only
	addi	$v0,$zero,13
	syscall
	bltz	$v0,baoloi
	sw	$v0,fdescr
  # ghi file
    # 32 bit dulieu1
  	lw	$a0,fdescr	
  	la	$a1,dulieu1
  	addi	$a2,$zero,32
  	addi	$v0,$zero,15
  	syscall
    # 32 bit dulieu2
  	la	$a1,dulieu2
  	addi	$a2,$zero,32
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
# Xuat ket qua (syscall)
# Ket thuc chuong trinh (syscall)
Kthuc:	addiu	$v0,$zero,10
	syscall
#-----------------------------------
