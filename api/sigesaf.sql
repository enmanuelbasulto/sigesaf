SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sigesaf`
--
CREATE DATABASE IF NOT EXISTS `sigesaf` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `sigesaf`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `computadoras`
--

DROP TABLE IF EXISTS `computadoras`;
CREATE TABLE `computadoras` (
  `id` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `id_pc` int(11) NOT NULL,
  `id_monitor` int(11) DEFAULT NULL,
  `id_teclado` int(11) DEFAULT NULL,
  `id_mouse` int(11) DEFAULT NULL,
  `id_speaker` int(11) DEFAULT NULL,
  `id_ups` int(11) DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `computadoras`
--

TRUNCATE TABLE `computadoras`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

DROP TABLE IF EXISTS `equipos`;
CREATE TABLE `equipos` (
  `id` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `no_inv` int(11) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `sello` int(11) DEFAULT NULL,
  `id_marca` int(11) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `equipos`
--

TRUNCATE TABLE `equipos`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_equipos`
--

DROP TABLE IF EXISTS `estados_equipos`;
CREATE TABLE `estados_equipos` (
  `id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `estados_equipos`
--

TRUNCATE TABLE `estados_equipos`;
--
-- Volcado de datos para la tabla `estados_equipos`
--

INSERT INTO `estados_equipos` (`id`, `estado`, `descripcion`) VALUES
(1, 'Dictaminado', 'Dictaminado por COPEXTEL'),
(2, 'Roto', 'No funciona '),
(3, 'Funcionando', 'Funcionando perfectamente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_prestamos`
--

DROP TABLE IF EXISTS `estados_prestamos`;
CREATE TABLE `estados_prestamos` (
  `id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `estados_prestamos`
--

TRUNCATE TABLE `estados_prestamos`;
--
-- Volcado de datos para la tabla `estados_prestamos`
--

INSERT INTO `estados_prestamos` (`id`, `estado`, `descripcion`) VALUES
(1, 'En espera', 'La solicitud está pendiente de aprobación'),
(2, 'Aprobado', 'Aprobada la solicitud de prestamo'),
(3, 'Denegada', 'Denegada la solicitud de prestamo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_reportes`
--

DROP TABLE IF EXISTS `estados_reportes`;
CREATE TABLE `estados_reportes` (
  `id` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `estados_reportes`
--

TRUNCATE TABLE `estados_reportes`;
--
-- Volcado de datos para la tabla `estados_reportes`
--

INSERT INTO `estados_reportes` (`id`, `estado`, `descripcion`) VALUES
(1, 'Roto', 'Equipo roto'),
(2, 'Con problemas', 'Equipo funcionando con problemas'),
(3, 'Dictaminado', 'Equipo dictaminado por copextel');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `locales`
--

DROP TABLE IF EXISTS `locales`;
CREATE TABLE `locales` (
  `id` int(11) NOT NULL,
  `local` varchar(48) NOT NULL,
  `id_padre` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `locales`
--

TRUNCATE TABLE `locales`;
--
-- Volcado de datos para la tabla `locales`
--

INSERT INTO `locales` (`id`, `local`, `id_padre`) VALUES
(1, '(raiz)', NULL),
(2, 'Cuba', 1),
(3, 'Camaguey', 2),
(4, 'IPVCE Maximo Gomez Baez', 3),
(5, 'IPVCE', 4),
(6, 'IPU', 4),
(7, 'IPI', 4),
(8, 'Direccion IPI', 7),
(9, 'Departamento de F. Tecnica', 7),
(14, 'Laboratorio 5', 7),
(15, 'Laboratorio 6', 7),
(16, 'Direccion IPU', 6),
(17, 'Unidad Presupuestada', 4),
(18, 'Direccion General', 4),
(19, 'Laboratorio 1', 5),
(20, 'Laboratorio 2', 5),
(21, 'Laboratorio 3', 5),
(22, 'Laboratorio 7', 7),
(23, 'Laboratorio 8', 7),
(24, 'Laboratorio 10', 6),
(25, 'Secretaria Docente IPI', 7),
(26, 'Subdireccion IPI', 7),
(27, 'Secretaria Docente IPU', 6),
(28, 'Subdireccion Docente IPU', 6),
(29, 'Direccion IPVCE', 5),
(30, 'Secretaria Docente IPVCE', 5),
(31, 'Almacen de Ocio', 4),
(32, 'Almacen', 4),
(33, 'ATM', 17),
(34, 'Aula Tecnologica', 5),
(36, 'CDIP', 5),
(37, 'Contabilidad', 17),
(39, 'Estadistica', 17),
(40, 'Inversiones', 17),
(42, 'Laboratorio de Concursos', 5),
(43, 'Laboratorio de Profesores', 5),
(44, 'Tecnologia Educativa', 18),
(45, 'Nodo', 44),
(46, 'OTS', 17),
(47, 'Protocolo', 18),
(48, 'Secretaria General', 18),
(49, 'Subdireccion Administrativa', 17),
(50, 'Subdireccion General', 18),
(51, 'COPEXTEL', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs`
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `tabla` varchar(25) NOT NULL,
  `tipo_cambio` smallint(6) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `objeto` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `logs`
--

TRUNCATE TABLE `logs`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marcas`
--

DROP TABLE IF EXISTS `marcas`;
CREATE TABLE `marcas` (
  `id` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `marcas`
--

TRUNCATE TABLE `marcas`;
--
-- Volcado de datos para la tabla `marcas`
--

INSERT INTO `marcas` (`id`, `marca`) VALUES
(1, '(no especificado)'),
(2, 'HP'),
(3, 'Atec-Haitech'),
(4, 'Logitech'),
(5, 'IMicro'),
(6, 'ASUS'),
(7, 'Atec-Haier'),
(8, 'Centela'),
(9, 'Foxcon'),
(10, 'Founder'),
(11, 'FSP'),
(12, 'Gelect'),
(13, 'Hanel'),
(14, 'LG'),
(15, 'Logic'),
(16, 'Loyal'),
(17, 'LTEL'),
(18, 'THTF'),
(19, 'Mitsumi'),
(20, 'Aoc'),
(21, 'Atec');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
CREATE TABLE `mensajes` (
  `id` int(11) NOT NULL,
  `id_usuario_origen` int(11) NOT NULL,
  `id_usuario_destino` int(11) NOT NULL,
  `asunto` varchar(50) DEFAULT NULL,
  `mensaje` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `mensajes`
--

TRUNCATE TABLE `mensajes`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

DROP TABLE IF EXISTS `prestamos`;
CREATE TABLE `prestamos` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `motivo` varchar(255) NOT NULL,
  `recibe` varchar(80) NOT NULL,
  `local_req` varchar(50) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `id_local_dest` int(11) DEFAULT NULL,
  `id_estado` int(11) NOT NULL,
  `id_usuario_req` int(11) NOT NULL,
  `id_usuario_aut` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `prestamos`
--

TRUNCATE TABLE `prestamos`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes`
--

DROP TABLE IF EXISTS `reportes`;
CREATE TABLE `reportes` (
  `id` int(11) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `problema` varchar(255) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_equipo` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `reportes`
--

TRUNCATE TABLE `reportes`;
-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_equipos`
--

DROP TABLE IF EXISTS `tipos_equipos`;
CREATE TABLE `tipos_equipos` (
  `id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `tipos_equipos`
--

TRUNCATE TABLE `tipos_equipos`;
--
-- Volcado de datos para la tabla `tipos_equipos`
--

INSERT INTO `tipos_equipos` (`id`, `tipo`, `descripcion`) VALUES
(1, 'PC', 'Computadora'),
(2, 'Monitor', 'Pantalla de computadora'),
(3, 'Teclado', 'Dispositivo de entrada de texto'),
(4, 'Mouse', 'Dispositivo señalador'),
(5, 'UPS', 'Fuente de respaldo de energía'),
(6, 'Caja decodificadora', 'Caja decodificadora de señal digital'),
(7, 'Laptop', 'Computadora portátil'),
(8, 'Cliente ligero', 'Computadora sin disco duro'),
(9, 'Servidor', 'Computadora que ofrece servicios de red'),
(10, 'Proyector', 'Proyector de video'),
(11, 'Base de carga', 'Base de carga para tablets'),
(12, 'Switch', 'Conmutador de paquetes de red'),
(13, 'Tableta electrónica', 'Dispositivo híbrido entre un teléfono y una laltop'),
(14, 'Televisor', 'Dispositivo para acceder a la señal de televisión'),
(15, 'APN Wi-Fi', 'Punto de Acceso Inalámbrico'),
(16, 'Speaker', 'Bocinas de computadora'),
(17, '(no especificado)', 'No está especificado claramente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `clave` varchar(40) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 30,
  `id_local` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Truncar tablas antes de insertar `usuarios`
--

TRUNCATE TABLE `usuarios`;
--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `nombre`, `clave`, `admin`, `id_local`) VALUES
(1, 'admin', 'Administrador general', 'd033e22ae348aeb5660fc2140aec35850c4da997', 1, 1),
(2, 'ebm', 'Enmanuel Basulto Martínez', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', 1, 4);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `computadoras`
--
ALTER TABLE `computadoras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_pc` (`id_pc`),
  ADD UNIQUE KEY `id_monitor` (`id_monitor`,`id_teclado`,`id_mouse`,`id_speaker`,`id_ups`),
  ADD KEY `id_local` (`id_local`,`id_pc`,`id_monitor`,`id_teclado`,`id_mouse`,`id_speaker`,`id_ups`),
  ADD KEY `id_teclado` (`id_teclado`),
  ADD KEY `id_mouse` (`id_mouse`),
  ADD KEY `id_speaker` (`id_speaker`),
  ADD KEY `id_ups` (`id_ups`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_local` (`id_local`,`id_marca`,`id_tipo`,`id_estado`),
  ADD KEY `id_estado` (`id_estado`),
  ADD KEY `id_marca` (`id_marca`),
  ADD KEY `id_tipo` (`id_tipo`);

--
-- Indices de la tabla `estados_equipos`
--
ALTER TABLE `estados_equipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estados_prestamos`
--
ALTER TABLE `estados_prestamos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estados_reportes`
--
ALTER TABLE `estados_reportes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `locales`
--
ALTER TABLE `locales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `local` (`local`),
  ADD KEY `id_padre` (`id_padre`);

--
-- Indices de la tabla `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `marcas`
--
ALTER TABLE `marcas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario_origen` (`id_usuario_origen`,`id_usuario_destino`),
  ADD KEY `id_usuario_destino` (`id_usuario_destino`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_equipo` (`id_equipo`,`id_local_dest`,`id_estado`,`id_usuario_req`,`id_usuario_aut`),
  ADD KEY `id_usuario_req` (`id_usuario_req`),
  ADD KEY `id_usuario_aut` (`id_usuario_aut`),
  ADD KEY `id_local` (`id_local_dest`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`,`id_equipo`,`id_estado`),
  ADD KEY `id_equipo` (`id_equipo`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `tipos_equipos`
--
ALTER TABLE `tipos_equipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`),
  ADD KEY `id_local` (`id_local`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `computadoras`
--
ALTER TABLE `computadoras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados_equipos`
--
ALTER TABLE `estados_equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados_prestamos`
--
ALTER TABLE `estados_prestamos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados_reportes`
--
ALTER TABLE `estados_reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `locales`
--
ALTER TABLE `locales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marcas`
--
ALTER TABLE `marcas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_equipos`
--
ALTER TABLE `tipos_equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `computadoras`
--
ALTER TABLE `computadoras`
  ADD CONSTRAINT `computadoras_ibfk_1` FOREIGN KEY (`id_local`) REFERENCES `locales` (`id`),
  ADD CONSTRAINT `computadoras_ibfk_2` FOREIGN KEY (`id_pc`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `computadoras_ibfk_3` FOREIGN KEY (`id_monitor`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `computadoras_ibfk_4` FOREIGN KEY (`id_teclado`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `computadoras_ibfk_5` FOREIGN KEY (`id_mouse`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `computadoras_ibfk_6` FOREIGN KEY (`id_speaker`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `computadoras_ibfk_7` FOREIGN KEY (`id_ups`) REFERENCES `equipos` (`id`);

--
-- Filtros para la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`id_estado`) REFERENCES `estados_equipos` (`id`),
  ADD CONSTRAINT `equipos_ibfk_2` FOREIGN KEY (`id_local`) REFERENCES `locales` (`id`),
  ADD CONSTRAINT `equipos_ibfk_3` FOREIGN KEY (`id_marca`) REFERENCES `marcas` (`id`),
  ADD CONSTRAINT `equipos_ibfk_4` FOREIGN KEY (`id_tipo`) REFERENCES `tipos_equipos` (`id`);

--
-- Filtros para la tabla `locales`
--
ALTER TABLE `locales`
  ADD CONSTRAINT `locales_ibfk_1` FOREIGN KEY (`id_padre`) REFERENCES `locales` (`id`);

--
-- Filtros para la tabla `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`id_usuario_origen`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`id_usuario_destino`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`id_usuario_req`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `prestamos_ibfk_2` FOREIGN KEY (`id_usuario_aut`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `prestamos_ibfk_3` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `prestamos_ibfk_4` FOREIGN KEY (`id_local_dest`) REFERENCES `locales` (`id`),
  ADD CONSTRAINT `prestamos_ibfk_5` FOREIGN KEY (`id_estado`) REFERENCES `estados_prestamos` (`id`);

--
-- Filtros para la tabla `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `reportes_ibfk_2` FOREIGN KEY (`id_equipo`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `reportes_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estados_reportes` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_local`) REFERENCES `locales` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
