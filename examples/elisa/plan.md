All devices endpoint: https://elisa.fi/kauppa/rest/products/devices (quite large 40MB)
For HANDSET-XXXXX items, create a page for each of them... if two or more have the same `mainProductName`, combine them, and on the page you can select the different varients

for example iphone 17 pro 256 gt page: `/tuote/apple-iphone-17-pro-256-gt-5g`
contains three items:
https://elisa.fi/kauppa/rest/products?uid=HANDSET-26437
https://elisa.fi/kauppa/rest/products?uid=HANDSET-26440
https://elisa.fi/kauppa/rest/products?uid=HANDSET-26443

look at categories.md, there shoud be a page for each of those categories eg. phones page: `/laitteet/puhelimet_ja_tarvikkeet/puhelimet` on this page display every item that has, for example, one of the categories: [30, 31, 32, 34, 153, 158] 






