<?php
/**
 * Created by PhpStorm.
 * User: diegobarrioh
 * Date: 25/8/15
 * Time: 13:18
 */

namespace AppBundle\Doctrine\DQL;

use Doctrine\ORM\Query\AST\Functions\FunctionNode;
use Doctrine\ORM\Query\Lexer;
use Doctrine\ORM\Query\SqlWalker;
use Doctrine\ORM\Query\Parser;

/**
 * Class DateFunction
 *
 * @package AppBundle\Doctrine\DQL
 */
class DateFunction extends FunctionNode
{
    private $arg;

    /**
     * @param SqlWalker $sqlWalker
     *
     * @return string
     */
    public function getSql(SqlWalker $sqlWalker)
    {
        return sprintf('DATE(%s)', $this->arg->dispatch($sqlWalker));
    }

    /**
     * @param Parser $parser
     */
    public function parse(Parser $parser)
    {
        $parser->match(Lexer::T_IDENTIFIER);
        $parser->match(Lexer::T_OPEN_PARENTHESIS);

        $this->arg = $parser->ArithmeticPrimary();

        $parser->match(Lexer::T_CLOSE_PARENTHESIS);
    }
}
