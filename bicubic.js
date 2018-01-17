/**
 * 缩放算法
 * 双立方（三次）卷积插值，图像更真实
 * 计算周围16个点
 * 取一阶导数值为二阶差分值的情况，满足插值函数一阶导函数连续
 * 函数逼近程度和三次样条插值效果一样，非常的高
 *
 * 公式：（矩阵乘法）
 * 推导公式
 * http://blog.csdn.net/qq_24451605/article/details/49474113
 * https://en.wikipedia.org/wiki/Bicubic_interpolation
 * */

/**
 * 采样公式的常数A取值,调整锐化与模糊
 * -0.5 三次Hermite样条
 * -0.75 常用值之一
 * -1 逼近y = sin(x*PI)/(x*PI)
 * -2 常用值之一
 */
const A = -0.1;

function interpolationCalculate(x) {
    const absX = x >= 0 ? x : -x;
    const x2 = x * x;
    const x3 = absX * x2;
    
    if (absX <= 1) {
        return 1 - (A + 3) * x2 + (A + 2) * x3;
    } else if (absX <= 2) {
        return -4 * A + 8 * A * absX - 5 * A * x2 + A * x3;
    }
    
    return 0;
}


function bicubic_unrolled(pixels, x, y, width) {
      var a, b, c, d, v0, v1, v2, v3, r, g, b;
      var fx = x ^ 0;
      var fy = y ^ 0;
      var percentX = x - fx;
      var percentY = y - fy;
  
      var fx14 = fx * 4;
      var fx04 = fx14 - 4;
      var fx24 = fx14 + 4;
      var fx34 = fx14 + 8;
      var w4 = width * 4;
      var yw14r = fy * w4;
      var yw04r = yw14r - w4;
      var yw24r = yw14r + w4;
      var yw34r = yw14r + w4 + w4;
      var yw14g = yw14r + 1;
      var yw04g = yw04r + 1;
      var yw24g = yw24r + 1;
      var yw34g = yw34r + 1;
      var yw14b = yw14r + 2;
      var yw04b = yw04r + 2;
      var yw24b = yw24r + 2;
      var yw34b = yw34r + 2;
      
      // Red
      a = pixels[yw04r + fx04];
      b = pixels[yw04r + fx14];
      c = pixels[yw04r + fx24];
      d = pixels[yw04r + fx34];
      v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;
      
      a = pixels[yw14r + fx04];
      b = pixels[yw14r + fx14];
      c = pixels[yw14r + fx24];
      d = pixels[yw14r + fx34];
      v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;
      
      a = pixels[yw24r + fx04];
      b = pixels[yw24r + fx14];
      c = pixels[yw24r + fx24];
      d = pixels[yw24r + fx34];
      v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;
      
      a = pixels[yw34r + fx04];
      b = pixels[yw34r + fx14];
      c = pixels[yw34r + fx24];
      d = pixels[yw34r + fx34];
      v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;
  
      a = v0;
      b = v1;
      c = v2;
      d = v3;
      r = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
      r = r > 255 ? 255 : r < 0 ? 0 : r ^ 0;
      
      // Green
      a = pixels[yw04g + fx04];
      b = pixels[yw04g + fx14];
      c = pixels[yw04g + fx24];
      d = pixels[yw04g + fx34];
      v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;
      
      a = pixels[yw14g + fx04];
      b = pixels[yw14g + fx14];
      c = pixels[yw14g + fx24];
      d = pixels[yw14g + fx34];
      v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;
      
      a = pixels[yw24g + fx04];
      b = pixels[yw24g + fx14];
      c = pixels[yw24g + fx24];
      d = pixels[yw24g + fx34];
      v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;
      
      a = pixels[yw34g + fx04];
      b = pixels[yw34g + fx14];
      c = pixels[yw34g + fx24];
      d = pixels[yw34g + fx34];
      v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;
  
      a = v0;
      b = v1;
      c = v2;
      d = v3;
      g = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
      g = g > 255 ? 255 : g < 0 ? 0 : g ^ 0;
      
      // Blue
      a = pixels[yw04b + fx04];
      b = pixels[yw04b + fx14];
      c = pixels[yw04b + fx24];
      d = pixels[yw04b + fx34];
      v0 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v0 = v0 > 255 ? 255 : v0 < 0 ? 0 : v0;
      
      a = pixels[yw14b + fx04];
      b = pixels[yw14b + fx14];
      c = pixels[yw14b + fx24];
      d = pixels[yw14b + fx34];
      v1 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v1 = v1 > 255 ? 255 : v1 < 0 ? 0 : v1;
      
      a = pixels[yw24b + fx04];
      b = pixels[yw24b + fx14];
      c = pixels[yw24b + fx24];
      d = pixels[yw24b + fx34];
      v2 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v2 = v2 > 255 ? 255 : v2 < 0 ? 0 : v2;
      
      a = pixels[yw34b + fx04];
      b = pixels[yw34b + fx14];
      c = pixels[yw34b + fx24];
      d = pixels[yw34b + fx34];
      v3 = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentX) * percentX) * percentX + b;
      v3 = v3 > 255 ? 255 : v3 < 0 ? 0 : v3;
  
      a = v0;
      b = v1;
      c = v2;
      d = v3;
      b = 0.5 * (c - a + (2.0 * a - 5.0 * b + 4.0 * c - d + (3.0 * (b - c) + d - a) * percentY) * percentY) * percentY + b;
      b = b > 255 ? 255 : b < 0 ? 0 : b ^ 0;
      
      return [r, g, b];
  }

function getPixelValue(pixelValue) {
    let newPixelValue = pixelValue;

    newPixelValue = Math.min(255, newPixelValue);
    newPixelValue = Math.max(0, newPixelValue);

    return newPixelValue;
}

/**
 * 获取某行某列的像素对于的rgba值
 * @param {Object} data 图像数据
 * @param {Number} srcWidth 宽度
 * @param {Number} srcHeight 高度
 * @param {Number} row 目标像素的行
 * @param {Number} col 目标像素的列
 */
function getRGBAValue(data, srcWidth, srcHeight, row, col) {
    let newRow = row;
    let newCol = col;

    if (newRow >= srcHeight) {
        newRow = srcHeight - 1;
    } else if (newRow < 0) {
        newRow = 0;
    }

    if (newCol >= srcWidth) {
        newCol = srcWidth - 1;
    } else if (newCol < 0) {
        newCol = 0;
    }

    let newIndex = (newRow * srcWidth) + newCol;

    newIndex *= 4;

    return [
        data[newIndex + 0],
        data[newIndex + 1],
        data[newIndex + 2],
        data[newIndex + 3],
    ];
}

function scale(data, width, height, newWidth, newHeight) {
    var dstData = new Uint8ClampedArray(newWidth * newHeight * 4);
    	console.log(dstData);
    // 计算压缩后的缩放比
    const scaleW = newWidth / width;
    const scaleH = newHeight / height;

    const filter = (dstCol, dstRow) => {
        // 源图像中的坐标（可能是一个浮点）
        const srcCol = Math.min(width - 1, dstCol / scaleW);
        const srcRow = Math.min(height - 1, dstRow / scaleH);
        const intCol = Math.floor(srcCol);
        const intRow = Math.floor(srcRow);
		/*
        let dstI = (dstRow * newWidth) + dstCol;

        dstI *= 4;
		var rgb= bicubic_unrolled(data,srcRow,srcCol,4);
        dstData[dstI + 0] = rgb[0];
        dstData[dstI + 1] = rgb[1];
        dstData[dstI + 2] = rgb[2];
        dstData[dstI + 3] = 255;
		*/
        // 计算u和v
        const u = srcCol - intCol;
        const v = srcRow - intRow;

        // 真实的index，因为数组是一维的
        let dstI = (dstRow * newWidth) + dstCol;

        dstI *= 4;
        
        // 存储灰度值的权重卷积和
        const rgbaData = [0, 0, 0, 0];
        // 根据数学推导，16个点的f1*f2加起来是趋近于1的（可能会有浮点误差）
        // 因此就不再单独先加权值，再除了
        // 16个邻近点
        for (let m = -1; m <= 2; m += 1) {
            for (let n = -1; n <= 2; n += 1) {
                const rgba = getRGBAValue(data,width,height,intRow + m,intCol + n);
                // 一定要正确区分 m,n和u,v对应的关系，否则会造成图像严重偏差（譬如出现噪点等）
                // F(row + m, col + n)S(m - v)S(n - u)
                const f1 = interpolationCalculate(m - v);
                const f2 = interpolationCalculate(n - u);
                const weight = f1 * f2;
                
                rgbaData[0] += rgba[0] * weight;
                rgbaData[1] += rgba[1] * weight;
                rgbaData[2] += rgba[2] * weight;
                rgbaData[3] += rgba[3] * weight;
            }
        }
        
        dstData[dstI + 0] = getPixelValue(rgbaData[0]);
        dstData[dstI + 1] = getPixelValue(rgbaData[1]);
        dstData[dstI + 2] = getPixelValue(rgbaData[2]);
        dstData[dstI + 3] = getPixelValue(rgbaData[3]);
		
	
    };

    // 区块
    for (let col = 0; col < newWidth; col += 1) {
        for (let row = 0; row < newHeight; row += 1) {
            filter(col, row);
        }
    }
	console.log(dstData);
   return new ImageData(dstData, newWidth, newHeight);
}
