Secret S has length L(L>=8) bytes length.
You want to split it K(K>=2) of N(N>=2,K<=N,N<=maxShares) scheme. So only K of N shares can recover secret.

## Spitting secret
1. Generate random `csKey` of L-4 bytes length.
2. Calculate hash `csHash' = hmac_sha256(S,csKey)` and take 4 first bytes of it `csHash = take(4, csHash')`.
3. Build `cs` as `cs = csKey || csHash`, where `||` is concatenation, so you have `cs` of L bytes length.
4. Generate `K-2` random vectors `v1,.. vk-2` of `L` byte length
5. Let's define `K` points\[(x,y)\] `(1, v1),.., (k-2, vk-2)`, `(255, cs)`, `(0,s)` as __prime points__.
6. Interpolate `x=[k-1,.. N]` points based on __prime points__ by Lagrange Formula. 
   Interpolation is under GF(256) with AES polynomial(0x11b) for each byte. 
   Finally, you have N point `(1, v1),.., (k-2, vk-2),(k-1,vk-1), .. (N,vN)` as share points.
7. Each of `y` coordinate of share point is a `share`.
8. Check shares for one way recovery: combine all K shares of N, set x of the point to `[1..maxShares]`, so you have (xi,v1) ... (xj,vk), interpolate them on `x=0,x=255`, validate `cs`. 
   `cs` should be correct only on `xi..xj` exactly as we constructed them on 6 paragraph. Otherwise, redo 1-8 paragraphs.

## Recovering secret
1. Interpolate on `x=0,x=255` points `[(xi,sh1),(xi,sh2)..,(xj,shk)]` where `sh1..shk` is given shares and `xi,xj` is all `[1..maxShares]`, until checksum is valid.
2. Interpolation on `x=0` is a secret, where `checksum` is valid.
