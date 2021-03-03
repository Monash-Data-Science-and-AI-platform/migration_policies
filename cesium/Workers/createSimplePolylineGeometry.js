define(["./when-54c2dc71","./Cartesian2-49b1de22","./ArcType-dc1c5aee","./Transforms-e9dbfb40","./Color-91231c89","./ComponentDatatype-6d99a1ee","./Check-6c0211bc","./GeometryAttribute-669569db","./GeometryAttributes-4fcfcf40","./IndexDatatype-46306178","./Math-44e92d6b","./PolylinePipeline-eb80587e","./RuntimeError-2109023a","./WebGLConstants-76bb35d1","./EllipsoidGeodesic-a2d57ae0","./EllipsoidRhumbLine-9b557f71","./IntersectionTests-6ead8677","./Plane-8f7e53d1"],function(L,V,x,S,I,R,e,O,M,U,N,F,o,t,r,a,l,i){"use strict";function c(e){var o=(e=L.defaultValue(e,L.defaultValue.EMPTY_OBJECT)).positions,t=e.colors,r=L.defaultValue(e.colorsPerVertex,!1);this._positions=o,this._colors=t,this._colorsPerVertex=r,this._arcType=L.defaultValue(e.arcType,x.ArcType.GEODESIC),this._granularity=L.defaultValue(e.granularity,N.CesiumMath.RADIANS_PER_DEGREE),this._ellipsoid=L.defaultValue(e.ellipsoid,V.Ellipsoid.WGS84),this._workerName="createSimplePolylineGeometry";o=1+o.length*V.Cartesian3.packedLength;o+=L.defined(t)?1+t.length*I.Color.packedLength:1,this.packedLength=o+V.Ellipsoid.packedLength+3}c.pack=function(e,o,t){var r;t=L.defaultValue(t,0);var a=e._positions,l=a.length;for(o[t++]=l,r=0;r<l;++r,t+=V.Cartesian3.packedLength)V.Cartesian3.pack(a[r],o,t);var i=e._colors,l=L.defined(i)?i.length:0;for(o[t++]=l,r=0;r<l;++r,t+=I.Color.packedLength)I.Color.pack(i[r],o,t);return V.Ellipsoid.pack(e._ellipsoid,o,t),t+=V.Ellipsoid.packedLength,o[t++]=e._colorsPerVertex?1:0,o[t++]=e._arcType,o[t]=e._granularity,o},c.unpack=function(e,o,t){o=L.defaultValue(o,0);for(var r=e[o++],a=new Array(r),l=0;l<r;++l,o+=V.Cartesian3.packedLength)a[l]=V.Cartesian3.unpack(e,o);var i=0<(r=e[o++])?new Array(r):void 0;for(l=0;l<r;++l,o+=I.Color.packedLength)i[l]=I.Color.unpack(e,o);var n=V.Ellipsoid.unpack(e,o);o+=V.Ellipsoid.packedLength;var s=1===e[o++],p=e[o++],d=e[o];return L.defined(t)?(t._positions=a,t._colors=i,t._ellipsoid=n,t._colorsPerVertex=s,t._arcType=p,t._granularity=d,t):new c({positions:a,colors:i,ellipsoid:n,colorsPerVertex:s,arcType:p,granularity:d})};var H=new Array(2),W=new Array(2),Y={positions:H,height:W,ellipsoid:void 0,minDistance:void 0,granularity:void 0};return c.createGeometry=function(e){var o,t,r,a=e._positions,l=e._colors,i=e._colorsPerVertex,n=e._arcType,s=e._granularity,e=e._ellipsoid,p=N.CesiumMath.chordLength(s,e.maximumRadius),d=L.defined(l)&&!i,c=a.length,y=0;if(n===x.ArcType.GEODESIC||n===x.ArcType.RHUMB){var f,u,h=n===x.ArcType.GEODESIC?(f=N.CesiumMath.chordLength(s,e.maximumRadius),u=F.PolylinePipeline.numberOfPoints,F.PolylinePipeline.generateArc):(f=s,u=F.PolylinePipeline.numberOfPointsRhumbLine,F.PolylinePipeline.generateRhumbArc),C=F.PolylinePipeline.extractHeights(a,e),T=Y;if(n===x.ArcType.GEODESIC?T.minDistance=p:T.granularity=s,T.ellipsoid=e,d){for(var g=0,m=0;m<c-1;m++)g+=u(a[m],a[m+1],f)+1;o=new Float64Array(3*g),r=new Uint8Array(4*g),T.positions=H,T.height=W;var b=0;for(m=0;m<c-1;++m){H[0]=a[m],H[1]=a[m+1],W[0]=C[m],W[1]=C[m+1];var P=h(T);if(L.defined(l))for(var _=P.length/3,v=l[m],B=0;B<_;++B)r[b++]=I.Color.floatToByte(v.red),r[b++]=I.Color.floatToByte(v.green),r[b++]=I.Color.floatToByte(v.blue),r[b++]=I.Color.floatToByte(v.alpha);o.set(P,y),y+=P.length}}else if(T.positions=a,T.height=C,o=new Float64Array(h(T)),L.defined(l)){for(r=new Uint8Array(o.length/3*4),m=0;m<c-1;++m)y=function(e,o,t,r,a,l,i){var n=F.PolylinePipeline.numberOfPoints(e,o,a),s=t.red,p=t.green,d=t.blue,c=t.alpha,y=r.red,e=r.green,o=r.blue,a=r.alpha;if(I.Color.equals(t,r)){for(g=0;g<n;g++)l[i++]=I.Color.floatToByte(s),l[i++]=I.Color.floatToByte(p),l[i++]=I.Color.floatToByte(d),l[i++]=I.Color.floatToByte(c);return i}for(var f=(y-s)/n,u=(e-p)/n,h=(o-d)/n,C=(a-c)/n,T=i,g=0;g<n;g++)l[T++]=I.Color.floatToByte(s+g*f),l[T++]=I.Color.floatToByte(p+g*u),l[T++]=I.Color.floatToByte(d+g*h),l[T++]=I.Color.floatToByte(c+g*C);return T}(a[m],a[m+1],l[m],l[m+1],p,r,y);var A=l[c-1];r[y++]=I.Color.floatToByte(A.red),r[y++]=I.Color.floatToByte(A.green),r[y++]=I.Color.floatToByte(A.blue),r[y++]=I.Color.floatToByte(A.alpha)}}else{t=d?2*c-2:c,o=new Float64Array(3*t),r=L.defined(l)?new Uint8Array(4*t):void 0;var E=0,k=0;for(m=0;m<c;++m){var G=a[m];if(d&&0<m&&(V.Cartesian3.pack(G,o,E),E+=3,v=l[m-1],r[k++]=I.Color.floatToByte(v.red),r[k++]=I.Color.floatToByte(v.green),r[k++]=I.Color.floatToByte(v.blue),r[k++]=I.Color.floatToByte(v.alpha)),d&&m===c-1)break;V.Cartesian3.pack(G,o,E),E+=3,L.defined(l)&&(v=l[m],r[k++]=I.Color.floatToByte(v.red),r[k++]=I.Color.floatToByte(v.green),r[k++]=I.Color.floatToByte(v.blue),r[k++]=I.Color.floatToByte(v.alpha))}}e=new M.GeometryAttributes;e.position=new O.GeometryAttribute({componentDatatype:R.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:o}),L.defined(l)&&(e.color=new O.GeometryAttribute({componentDatatype:R.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:4,values:r,normalize:!0}));var A=2*((t=o.length/3)-1),w=U.IndexDatatype.createTypedArray(t,A),D=0;for(m=0;m<t-1;++m)w[D++]=m,w[D++]=m+1;return new O.Geometry({attributes:e,indices:w,primitiveType:O.PrimitiveType.LINES,boundingSphere:S.BoundingSphere.fromPoints(a)})},function(e,o){return(e=L.defined(o)?c.unpack(e,o):e)._ellipsoid=V.Ellipsoid.clone(e._ellipsoid),c.createGeometry(e)}});