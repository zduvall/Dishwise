User
---
id SERIAL PK
username STRING(30) #required unique
email STRING(255) #required unique
hashedPassword STRING.BINARY #required

Group
---
id SERIAL PK
groupOwnerId INT FK >- User.id #required
name STRING(50) #required unique
pntPrice DECIMAL(5,3) # default $0.10

UserJoinGroup #(join table)
---
id SERIAL PK
userId INT FK >- User.id #required
groupId INT FK >- Group.id #required

WashOrPay
---
id SERIAL PK
wshOrPyUsrId INT FK >- User.id #required
dshOrToUsrId INT FK >- User.id #required, can be None (for group dishes)
groupId INT FK >- Group.id #required
note STRING(35) #required
dishsize INT #required 0-5, utensil - crock pot (only 0 if pay != 0)
dishNum INT #required, 0-500, (only 0 if pay != 0)
dishDirt INT #required 0-5, clean - dirty, (only 0 if pay != 0)
pay DECIMAL(5,3) #required, default = 0
