(this.webpackJsonpnftstyle=this.webpackJsonpnftstyle||[]).push([[10,12,31,81],{1254:function(e,t,i){"use strict";var r=i(85),n=i(1279);e.exports=n((function(e){var t=r("sha256").update(e).digest();return r("sha256").update(t).digest()}))},1260:function(e,t,i){var r=i(311);e.exports=r("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")},1279:function(e,t,i){"use strict";var r=i(1260),n=i(27).Buffer;e.exports=function(e){function t(t){var i=t.slice(0,-4),r=t.slice(-4),n=e(i);if(!(r[0]^n[0]|r[1]^n[1]|r[2]^n[2]|r[3]^n[3]))return i}return{encode:function(t){var i=e(t);return r.encode(n.concat([t,i],t.length+4))},decode:function(e){var i=t(r.decode(e));if(!i)throw new Error("Invalid checksum");return i},decodeUnsafe:function(e){var i=r.decodeUnsafe(e);if(i)return t(i)}}}},1288:function(e,t,i){var r=i(62),n=i(27).Buffer,s=i(194),c=i(1254),a=i(313),o=n.from("Bitcoin seed","utf8"),u={private:76066276,public:76067358};function p(e){this.versions=e||u,this.depth=0,this.index=0,this._privateKey=null,this._publicKey=null,this.chainCode=null,this._fingerprint=0,this.parentFingerprint=0}function d(e,t,i){var r=n.allocUnsafe(78);r.writeUInt32BE(t,0),r.writeUInt8(e.depth,4);var s=e.depth?e.parentFingerprint:0;return r.writeUInt32BE(s,5),r.writeUInt32BE(e.index,9),e.chainCode.copy(r,13),i.copy(r,45),r}function h(e){var t=s.createHash("sha256").update(e).digest();return s.createHash("ripemd160").update(t).digest()}Object.defineProperty(p.prototype,"fingerprint",{get:function(){return this._fingerprint}}),Object.defineProperty(p.prototype,"identifier",{get:function(){return this._identifier}}),Object.defineProperty(p.prototype,"pubKeyHash",{get:function(){return this.identifier}}),Object.defineProperty(p.prototype,"privateKey",{get:function(){return this._privateKey},set:function(e){r.equal(e.length,32,"Private key must be 32 bytes."),r(!0===a.privateKeyVerify(e),"Invalid private key"),this._privateKey=e,this._publicKey=n.from(a.publicKeyCreate(e,!0)),this._identifier=h(this.publicKey),this._fingerprint=this._identifier.slice(0,4).readUInt32BE(0)}}),Object.defineProperty(p.prototype,"publicKey",{get:function(){return this._publicKey},set:function(e){r(33===e.length||65===e.length,"Public key must be 33 or 65 bytes."),r(!0===a.publicKeyVerify(e),"Invalid public key"),this._publicKey=n.from(a.publicKeyConvert(e,!0)),this._identifier=h(this.publicKey),this._fingerprint=this._identifier.slice(0,4).readUInt32BE(0),this._privateKey=null}}),Object.defineProperty(p.prototype,"privateExtendedKey",{get:function(){return this._privateKey?c.encode(d(this,this.versions.private,n.concat([n.alloc(1,0),this.privateKey]))):null}}),Object.defineProperty(p.prototype,"publicExtendedKey",{get:function(){return c.encode(d(this,this.versions.public,this.publicKey))}}),p.prototype.derive=function(e){if("m"===e||"M"===e||"m'"===e||"M'"===e)return this;var t=e.split("/"),i=this;return t.forEach((function(e,t){if(0!==t){var n=e.length>1&&"'"===e[e.length-1],s=parseInt(e,10);r(s<2147483648,"Invalid index"),n&&(s+=2147483648),i=i.deriveChild(s)}else r(/^[mM]{1}/.test(e),'Path must start with "m" or "M"')})),i},p.prototype.deriveChild=function(e){var t,i=e>=2147483648,c=n.allocUnsafe(4);if(c.writeUInt32BE(e,0),i){r(this.privateKey,"Could not derive hardened child key");var o=this.privateKey,u=n.alloc(1,0);o=n.concat([u,o]),t=n.concat([o,c])}else t=n.concat([this.publicKey,c]);var d=s.createHmac("sha512",this.chainCode).update(t).digest(),h=d.slice(0,32),f=d.slice(32),l=new p(this.versions);if(this.privateKey)try{l.privateKey=n.from(a.privateKeyTweakAdd(n.from(this.privateKey),h))}catch(y){return this.deriveChild(e+1)}else try{l.publicKey=n.from(a.publicKeyTweakAdd(n.from(this.publicKey),h,!0))}catch(y){return this.deriveChild(e+1)}return l.chainCode=f,l.depth=this.depth+1,l.parentFingerprint=this.fingerprint,l.index=e,l},p.prototype.sign=function(e){return n.from(a.ecdsaSign(e,this.privateKey).signature)},p.prototype.verify=function(e,t){return a.ecdsaVerify(Uint8Array.from(t),Uint8Array.from(e),Uint8Array.from(this.publicKey))},p.prototype.wipePrivateData=function(){return this._privateKey&&s.randomBytes(this._privateKey.length).copy(this._privateKey),this._privateKey=null,this},p.prototype.toJSON=function(){return{xpriv:this.privateExtendedKey,xpub:this.publicExtendedKey}},p.fromMasterSeed=function(e,t){var i=s.createHmac("sha512",o).update(e).digest(),r=i.slice(0,32),n=i.slice(32),c=new p(t);return c.chainCode=n,c.privateKey=r,c},p.fromExtendedKey=function(e,t){var i=new p(t=t||u),n=c.decode(e),s=n.readUInt32BE(0);r(s===t.private||s===t.public,"Version mismatch: does not match private or public"),i.depth=n.readUInt8(4),i.parentFingerprint=n.readUInt32BE(5),i.index=n.readUInt32BE(9),i.chainCode=n.slice(13,45);var a=n.slice(45);return 0===a.readUInt8(0)?(r(s===t.private,"Version mismatch: version does not match private"),i.privateKey=a.slice(1)):(r(s===t.public,"Version mismatch: version does not match public"),i.publicKey=a),i},p.fromJSON=function(e){return p.fromExtendedKey(e.xpriv)},p.HARDENED_OFFSET=2147483648,e.exports=p},1376:function(e,t,i){"use strict";i.r(t),i.d(t,"generateAddresses",(function(){return u})),i.d(t,"isValidPath",(function(){return p}));var r=i(1343),n=i(1288),s=i.n(n),c=i(9),a=r.publicToAddress,o=r.toChecksumAddress;function u(e,t){var i=e.publicKey,r=e.chainCode,n=e.path,u=new s.a;u.publicKey=new c.Buffer(i,"hex"),u.chainCode=new c.Buffer(r,"hex");for(var p=[],d=t;d<5+t;d++){var h=u.deriveChild(d),f=a(h.publicKey,!0).toString("hex");p.push({dPath:"".concat(n,"/").concat(d),address:o("0x".concat(f))})}return p}function p(e){var t=e.split("/");if("m"!==t[0])return!1;if("44'"!==t[1])return!1;if(!["60'","1'","73799'","246'"].includes(t[2]))return!1;if(void 0===t[3]||"0'"===t[3])return!0;var i=Number(t[3].slice(0,-1));if(isNaN(i)||i<0||"'"!==t[3].slice(-1))return!1;if(void 0===t[4])return!0;var r=Number(t[4]);if(isNaN(r)||r<0)return!1;if(void 0===t[5])return!0;var n=Number(t[5]);return!(isNaN(n)||n<0)}},1427:function(e,t){}}]);